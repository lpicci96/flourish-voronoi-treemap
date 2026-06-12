/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as d3 from "d3";
import { borderPath } from "./border";

/**
 * Build an SVG path `d` string from a polygon (no inset, no rounding).
 */
function polygonToPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Resample a polygon to exactly `count` evenly-spaced points along its perimeter.
 * Used to align two polygons with different vertex counts for smooth interpolation.
 */
function resamplePolygon(polygon, count) {
    const n = polygon.length;
    if (n === count) return polygon;
    if (n === 0 || count === 0) return polygon;

    const cumLen = [0];
    for (let i = 0; i < n; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % n];
        cumLen.push(cumLen[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
    }
    const total = cumLen[n];
    if (total < 1e-10) return polygon;

    const result = [];
    for (let i = 0; i < count; i++) {
        const dist = (i / count) * total;
        let seg = 0;
        while (seg < n - 1 && cumLen[seg + 1] < dist) seg++;
        const segLen = cumLen[seg + 1] - cumLen[seg];
        const t = segLen > 0 ? (dist - cumLen[seg]) / segLen : 0;
        const a = polygon[seg];
        const b = polygon[(seg + 1) % n];
        result.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return result;
}

/**
 * Apply transitions to a D3 join on voronoi cells.
 *
 * Two layers:
 * - `g.cell-fills`: inset + rounded polygon fills with smooth polygon morphing.
 * - `g.cell-hits`: invisible paths for click/hover (updated instantly).
 *
 * Entering cells appear instantly. Updating cells morph via point-by-point
 * interpolation. Exiting cells fade out.
 */
export function transitionCells({ selection, leaves, duration, borderStyle, gap, radiusPx, reach, insetGroupByParent, fillFn, applyEvents }) {

    function cellFillPath(d) {
        var clipPoly = insetGroupByParent ? insetGroupByParent.get(d.parent) : null;
        return borderPath(d.polygon, borderStyle, gap, radiusPx, reach, clipPoly);
    }

    // --- Ensure layers exist in order ---
    if (selection.select("g.cell-fills").empty()) selection.append("g").attr("class", "cell-fills");
    if (selection.select("g.cell-hits").empty()) selection.append("g").attr("class", "cell-hits");

    const fillGroup = selection.select("g.cell-fills");
    const hitGroup = selection.select("g.cell-hits");

    const key = d => d.ancestors().map(n => n.data.name).reverse().join("\0");

    // --- FILL LAYER ---
    const fillJoin = fillGroup.selectAll("path").data(leaves, key);

    // EXIT
    if (duration > 0) {
        fillJoin.exit()
            .transition().duration(duration).ease(d3.easeCubicInOut)
            .attr("opacity", 0)
            .remove();
    } else {
        fillJoin.exit().remove();
    }

    // ENTER — always instant, no fade-in
    fillJoin.enter().append("path")
        .attr("d", cellFillPath)
        .attr("fill", fillFn)
        .attr("stroke", "none")
        .attr("opacity", 1)
        .each(function(d) { this.__polygon = d.polygon; });

    // UPDATE
    if (duration > 0) {
        fillJoin.each(function(d) {
            const el = d3.select(this);
            // Surviving cells are always fully visible: cancel any in-flight
            // transition (e.g. a fade-out left over from a data-join churn during
            // load) and snap opacity to 1 synchronously, so a cell can never
            // animate a fade-in. Only geometry (and fill) is transitioned.
            el.interrupt().attr("opacity", 1);
            const oldPoly = this.__polygon || d.polygon;
            const newPoly = d.polygon;
            const count = Math.max(oldPoly.length, newPoly.length, 8);
            const oldResampled = resamplePolygon(oldPoly, count);
            const newResampled = resamplePolygon(newPoly, count);

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", function() {
                    const clipPoly = insetGroupByParent ? insetGroupByParent.get(d.parent) : null;
                    return function(t) {
                        const interp = oldResampled.map(function(pt, i) {
                            return [
                                pt[0] + (newResampled[i][0] - pt[0]) * t,
                                pt[1] + (newResampled[i][1] - pt[1]) * t
                            ];
                        });
                        return borderPath(interp, borderStyle, gap, radiusPx, reach, clipPoly);
                    };
                })
                .attr("fill", fillFn)
                .on("end", function() {
                    this.__polygon = d.polygon;
                    d3.select(this).attr("d", cellFillPath(d));
                });
        });
    } else {
        fillJoin
            .attr("d", cellFillPath)
            .attr("fill", fillFn)
            .attr("stroke", "none")
            .each(function(d) { this.__polygon = d.polygon; });
    }

    // --- HIT LAYER (instant — invisible layer) ---
    const hitJoin = hitGroup.selectAll("path").data(leaves, key);
    hitJoin.exit().remove();

    hitJoin.enter().append("path")
        .attr("d", d => polygonToPath(d.polygon))
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .call(applyEvents);

    hitJoin
        .attr("d", d => polygonToPath(d.polygon))
        .call(applyEvents);
}
