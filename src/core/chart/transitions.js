import * as d3 from "d3";
import { interpolate as flubberInterpolate } from "flubber";
import { borderPath, combinedBorderPath } from "./border";

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
 * Four layers:
 * - `g.cell-fills`: straight polygon fills, clipped to the combined border
 *   shape via a `<clipPath>` when rounding is active.
 * - `g.cell-borders`: per-cell border paths that morph with Flubber.
 * - `g.cell-hits`: invisible paths for mouse events.
 *
 * All per-cell layers (fills, borders, hits) animate with Flubber morphing.
 * Entering cells fade in, exiting cells fade out. The clip path updates at
 * the end of the transition so rounded borders stay visually correct.
 */
export function transitionCells({ selection, leaves, duration, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption, fillFn, applyStyle, applyEvents }) {

    const polygons = leaves.map(d => d.polygon);
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

    // Helper to compute a cell's border path string
    function cellBorderPath(d) {
        return borderPath(d.polygon, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption);
    }

    // --- Ensure layers exist in order ---
    // Migrate from old single-path border to group-based borders
    selection.select("path.cell-border").remove();
    if (selection.select("g.cell-fills").empty()) selection.append("g").attr("class", "cell-fills");
    if (selection.select("g.cell-borders").empty()) selection.append("g").attr("class", "cell-borders");
    if (selection.select("g.cell-hits").empty()) selection.append("g").attr("class", "cell-hits");

    const fillGroup = selection.select("g.cell-fills");
    const borderGroup = selection.select("g.cell-borders");
    const hitGroup = selection.select("g.cell-hits");

    // When animating with rounding, temporarily disable the clip so fills
    // aren't clipped to the stale shape mid-morph. Re-enable after transition.
    if (duration > 0 && needsClip) {
        fillGroup.attr("clip-path", null);
    } else {
        fillGroup.attr("clip-path", needsClip ? "url(#" + clipId + ")" : null);
    }

    const key = d => d.data.name;

    // --- FILL LAYER ---
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
        .attr("d", d => polygonToPath(d.polygon))
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

    // --- BORDER LAYER (per-cell paths with Flubber morphing) ---
    const borderJoin = borderGroup.selectAll("path").data(leaves, key);

    if (duration > 0) {
        borderJoin.exit()
            .transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 0)
            .remove();
    } else {
        borderJoin.exit().remove();
    }

    const borderEnter = borderJoin.enter().append("path")
        .attr("d", cellBorderPath)
        .attr("fill", "none");
    applyStyle(borderEnter);

    if (duration > 0) {
        borderEnter.attr("opacity", 0)
            .transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 1);
    }

    const borderUpdate = borderJoin;
    if (duration > 0) {
        borderUpdate.each(function(d) {
            const el = d3.select(this);
            const oldPath = el.attr("d");
            const newPath = cellBorderPath(d);
            const morph = flubberInterpolate(oldPath, newPath, { maxSegmentLength: 10 });

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", () => morph)
                .on("end", function() {
                    d3.select(this).attr("d", cellBorderPath(d));
                });
        });
        applyStyle(borderUpdate);
    } else {
        borderUpdate
            .attr("d", cellBorderPath)
            .attr("fill", "none");
        applyStyle(borderUpdate);
    }

    // Update clip path after transitions complete (or instantly if no animation)
    if (duration > 0 && needsClip) {
        const combinedD = combinedBorderPath(polygons, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption);
        d3.timeout(function() {
            clipPathEl.select("path").attr("d", combinedD);
            fillGroup.attr("clip-path", "url(#" + clipId + ")");
        }, duration);
    } else {
        const combinedD = needsClip
            ? combinedBorderPath(polygons, borderStyle, borderRoundingSize, borderMaxAngleFactor, borderMaxEdgeConsumption)
            : null;
        clipPathEl.select("path").attr("d", combinedD);
    }

    // --- HIT LAYER ---
    const hitJoin = hitGroup.selectAll("path").data(leaves, key);

    if (duration > 0) {
        hitJoin.exit()
            .transition()
            .duration(duration)
            .remove();
    } else {
        hitJoin.exit().remove();
    }

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