import * as d3 from "d3";
import { interpolate as flubberInterpolate } from "flubber";

/**
 * Build an SVG path `d` string from a polygon.
 */
function polygonToPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Apply transitions to a D3 join on voronoi cells.
 *
 * - Enter: appear instantly with new shape.
 * - Update: morph polygon using flubber + interpolate fill color with easing.
 * - Exit: remove instantly.
 *
 * @param {object} params
 * @param {Selection} params.selection - g.cells group.
 * @param {Array} params.leaves - New leaf data.
 * @param {number} params.duration - Transition duration in ms.
 * @param {Function} params.pathFn - Function(d) returning SVG path string.
 * @param {Function} params.fillFn - Function(d) returning fill color string.
 * @param {Function} params.applyStyle - Function(selection) applying stroke attrs.
 * @param {Function} params.applyEvents - Function(selection) applying event listeners.
 */
export function transitionCells({ selection, leaves, duration, pathFn, fillFn, applyStyle, applyEvents }) {
    const joined = selection.selectAll("path")
        .data(leaves, d => d.data.name);

    // EXIT
    joined.exit().remove();

    // ENTER
    const enter = joined.enter().append("path");
    enter.attr("d", pathFn)
        .attr("fill", fillFn);
    applyStyle(enter);
    applyEvents(enter);

    // UPDATE
    const update = joined;
    if (duration > 0) {
        update.each(function(d) {
            const el = d3.select(this);
            const oldPath = el.attr("d");
            const newPath = polygonToPath(d.polygon);

            applyStyle(el);

            const morph = flubberInterpolate(oldPath, newPath, { maxSegmentLength: 10 });

            el.transition()
                .duration(duration)
                .ease(d3.easeCubicInOut)
                .attrTween("d", () => morph)
                .attr("fill", fillFn)
                .on("end", function() {
                    d3.select(this).attr("d", pathFn);
                });
        });
    } else {
        update.attr("d", pathFn)
            .attr("fill", fillFn);
        applyStyle(update);
    }
    applyEvents(update);
}