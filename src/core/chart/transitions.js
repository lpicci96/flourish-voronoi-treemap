import * as d3 from "d3";
import { interpolate as flubberInterpolate } from "flubber";
import { borderPath } from "./border";

/**
 * Build an SVG path `d` string from a polygon (no inset, no rounding).
 */
function polygonToPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Apply transitions to a D3 join on voronoi cells.
 *
 * Two layers:
 * - `g.cell-fills`: inset + rounded polygon fills (background shows through gaps).
 *   Animated with Flubber morphing. Entering cells fade in, exiting cells fade out.
 * - `g.cell-hits`: invisible paths using original (non-inset) polygons for
 *   full click/hover coverage. Updated instantly (no animation needed).
 */
export function transitionCells({ selection, leaves, duration, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption, gap, fillFn, applyEvents }) {

    // Helper to compute a cell's fill path (inset + rounding applied)
    function cellFillPath(d) {
        return borderPath(d.polygon, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption, gap);
    }

    // --- Ensure layers exist in order ---
    if (selection.select("g.cell-fills").empty()) selection.append("g").attr("class", "cell-fills");
    if (selection.select("g.cell-hits").empty()) selection.append("g").attr("class", "cell-hits");

    const fillGroup = selection.select("g.cell-fills");
    const hitGroup = selection.select("g.cell-hits");

    const key = d => d.data.name;

    // --- FILL LAYER (animated) ---
    const fillJoin = fillGroup.selectAll("path").data(leaves, key);

    if (duration > 0) {
        fillJoin.exit()
            .transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 0)
            .remove();
    } else {
        fillJoin.exit().remove();
    }

    const fillEnter = fillJoin.enter().append("path")
        .attr("d", cellFillPath)
        .attr("fill", fillFn)
        .attr("stroke", "none");

    if (duration > 0) {
        fillEnter.attr("opacity", 0)
            .transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 1);
    }

    const fillUpdate = fillJoin;
    if (duration > 0) {
        fillUpdate.each(function(d) {
            const el = d3.select(this);
            const oldPath = el.attr("d");
            const newPath = cellFillPath(d);
            const morph = flubberInterpolate(oldPath, newPath, { maxSegmentLength: 10 });

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", () => morph)
                .attr("fill", fillFn)
                .on("end", function() {
                    d3.select(this).attr("d", cellFillPath(d));
                });
        });
    } else {
        fillUpdate
            .attr("d", cellFillPath)
            .attr("fill", fillFn)
            .attr("stroke", "none");
    }

    // --- HIT LAYER (instant update, no animation needed — layer is invisible) ---
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
