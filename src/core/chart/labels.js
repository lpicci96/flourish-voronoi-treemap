import * as d3 from "d3";

/**
 * Compute the centroid of a polygon (average of all vertices).
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @returns {number[]} [cx, cy] centroid coordinates.
 */
function polygonCentroid(polygon) {
    let cx = 0, cy = 0;
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
        cx += polygon[i][0];
        cy += polygon[i][1];
    }
    return [cx / n, cy / n];
}

/**
 * Compute the area of a polygon using the shoelace formula.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @returns {number} Absolute area of the polygon.
 */
function polygonArea(polygon) {
    let area = 0;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        area += polygon[j][0] * polygon[i][1];
        area -= polygon[i][0] * polygon[j][1];
    }
    return Math.abs(area / 2);
}

/**
 * Render text labels for Voronoi treemap leaves.
 * @param {SVGElement} container - Target SVG DOM element.
 * @param {Array} leaves - Hierarchy leaves with valid polygons.
 * @param {object} labelSettings - Label settings ({ show_labels }).
 */
export function renderLabels(container, leaves, labelSettings) {
    const sel = d3.select(container);

    if (!labelSettings || !labelSettings.show_labels) {
        sel.selectAll("g.labels").remove();
        return;
    }

    let g = sel.selectAll("g.labels").data([null]);
    g = g.enter().append("g").attr("class", "labels").merge(g);

    const sizeProportionally = labelSettings.size_proportionally !== false;
    const areas = sizeProportionally ? leaves.map(d => polygonArea(d.polygon)) : null;
    const maxArea = sizeProportionally ? (d3.max(areas) || 1) : 1;

    let minSize = labelSettings.min_font_size != null ? labelSettings.min_font_size : 0.4;
    let maxSize = labelSettings.max_font_size != null ? labelSettings.max_font_size : 1.2;
    if (minSize > maxSize) {
        const mid = (minSize + maxSize) / 2;
        minSize = mid;
        maxSize = mid;
    }

    const labels = g.selectAll("text")
        .data(leaves, d => d.data.name);

    labels.exit().remove();

    const enter = labels.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("pointer-events", "none");

    enter.merge(labels)
        .text(d => d.data.name)
        .each(function(d, i) {
            const [cx, cy] = polygonCentroid(d.polygon);
            const fontSize = sizeProportionally
                ? minSize + (maxSize - minSize) * Math.sqrt(areas[i] / maxArea)
                : (labelSettings.font_size || 0.8);
            d3.select(this)
                .attr("x", cx)
                .attr("y", cy)
                .attr("font-size", fontSize + "em")
                .attr("fill", "#333");
        });
}
