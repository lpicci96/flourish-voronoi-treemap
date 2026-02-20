import * as d3 from "d3";
import { interpolate as flubberInterpolate } from "flubber";
import { combinedBorderPath } from "./border";

/**
 * Build an SVG path `d` string from a polygon.
 */
function polygonToPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

let clipIdCounter = 0;

/**
 * Apply transitions to a D3 join on voronoi cells.
 *
 * Three layers:
 * - `g.cell-fills`: straight polygon fills, clipped to the combined border
 *   shape via a `<clipPath>` when rounding is active.
 * - `path.cell-border`: single combined border path (always set instantly).
 * - `g.cell-hits`: invisible paths for mouse events.
 *
 * Only fill and hit paths animate (when data changes shape). The border
 * and clip path always update instantly so that style changes (color, size,
 * rounding) are reflected without a morph animation.
 */
export function transitionCells({ selection, leaves, duration, borderStyle, borderRoundingSize, borderMaxAngleFactor, fillFn, applyStyle, applyEvents }) {

    const polygons = leaves.map(d => d.polygon);
    const combinedD = combinedBorderPath(polygons, borderStyle, borderRoundingSize, borderMaxAngleFactor);
    const needsClip = borderStyle !== "straight";

    // --- CLIP PATH setup ---
    const svgNode = selection.node().ownerSVGElement || selection.node();
    const svg = d3.select(svgNode);
    if (svg.select("defs").empty()) svg.insert("defs", ":first-child");
    const defs = svg.select("defs");

    let clipId = selection.attr("data-clip-id");
    if (!clipId) {
        clipId = "voronoi-fill-clip-" + (clipIdCounter++);
        selection.attr("data-clip-id", clipId);
    }

    let clipPathEl = defs.select("#" + clipId);
    if (clipPathEl.empty()) {
        clipPathEl = defs.append("clipPath").attr("id", clipId);
        clipPathEl.append("path");
    }
    clipPathEl.select("path").attr("d", needsClip ? combinedD : null);

    // --- Ensure layers exist in order ---
    if (selection.select("g.cell-fills").empty()) selection.append("g").attr("class", "cell-fills");
    if (selection.select("path.cell-border").empty()) selection.append("path").attr("class", "cell-border");
    if (selection.select("g.cell-hits").empty()) selection.append("g").attr("class", "cell-hits");

    const fillGroup = selection.select("g.cell-fills");
    const borderEl = selection.select("path.cell-border");
    const hitGroup = selection.select("g.cell-hits");

    fillGroup.attr("clip-path", needsClip ? "url(#" + clipId + ")" : null);

    const key = d => d.data.name;

    // --- FILL LAYER ---
    const fillJoin = fillGroup.selectAll("path").data(leaves, key);
    fillJoin.exit().remove();

    const fillEnter = fillJoin.enter().append("path")
        .attr("d", d => polygonToPath(d.polygon))
        .attr("fill", fillFn)
        .attr("stroke", "none");

    const fillUpdate = fillJoin;
    if (duration > 0) {
        fillUpdate.each(function(d) {
            const el = d3.select(this);
            const oldPath = el.attr("d");
            const newPath = polygonToPath(d.polygon);
            const morph = flubberInterpolate(oldPath, newPath, { maxSegmentLength: 10 });

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", () => morph)
                .attr("fill", fillFn)
                .on("end", function() {
                    d3.select(this).attr("d", polygonToPath(d.polygon));
                });
        });
    } else {
        fillUpdate
            .attr("d", d => polygonToPath(d.polygon))
            .attr("fill", fillFn)
            .attr("stroke", "none");
    }

    // --- BORDER LAYER (always instant) ---
    borderEl
        .attr("d", combinedD)
        .attr("fill", "none");
    applyStyle(borderEl);

    // --- HIT LAYER ---
    const hitJoin = hitGroup.selectAll("path").data(leaves, key);
    hitJoin.exit().remove();

    const hitEnter = hitJoin.enter().append("path")
        .attr("d", d => polygonToPath(d.polygon))
        .attr("fill", "transparent")
        .attr("stroke", "none");
    applyEvents(hitEnter);

    const hitUpdate = hitJoin;
    if (duration > 0) {
        hitUpdate.each(function(d) {
            const el = d3.select(this);
            const oldPath = el.attr("d");
            const newPath = polygonToPath(d.polygon);
            const morph = flubberInterpolate(oldPath, newPath, { maxSegmentLength: 10 });

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", () => morph)
                .on("end", function() {
                    d3.select(this).attr("d", polygonToPath(d.polygon));
                });
        });
    } else {
        hitUpdate
            .attr("d", d => polygonToPath(d.polygon))
            .attr("fill", "transparent")
            .attr("stroke", "none");
    }
    applyEvents(hitUpdate);
}