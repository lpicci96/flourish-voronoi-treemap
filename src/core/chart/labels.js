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
 * Compute the horizontal width available inside a polygon at a given y-coordinate.
 * Casts a horizontal ray at y and finds the min/max x intersections with polygon edges.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} y - The y-coordinate to measure width at.
 * @returns {number} Available horizontal width, or 0 if no intersections found.
 */
function polygonWidthAtY(polygon, y) {
    const intersections = [];
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const [x1, y1] = polygon[j];
        const [x2, y2] = polygon[i];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
            const t = (y - y1) / (y2 - y1);
            intersections.push(x1 + t * (x2 - x1));
        }
    }
    if (intersections.length < 2) return 0;
    return Math.max(...intersections) - Math.min(...intersections);
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

    // Parse show_list into a set of names to filter by
    const showList = labelSettings.show_list
        ? new Set(labelSettings.show_list.split("\n").map(s => s.trim()).filter(Boolean))
        : null;

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
        .attr("font-weight", labelSettings.font_weight)
        .each(function(d, i) {
            const [cx, cy] = polygonCentroid(d.polygon);
            const fontSize = sizeProportionally
                ? minSize + (maxSize - minSize) * Math.sqrt(areas[i] / maxArea)
                : (labelSettings.font_size || 0.8);
            const el = d3.select(this);
            el.attr("x", cx)
                .attr("y", cy)
                .attr("font-size", fontSize + "em")
                .attr("fill", labelSettings.font_color);

            // Determine label visibility
            let visible = true;
            if (showList && showList.size > 0) {
                visible = showList.has(d.data.name);
            } else if (labelSettings.hide_small_labels) {
                const textWidth = this.getComputedTextLength();
                const margin = labelSettings.hide_margin != null ? labelSettings.hide_margin : 0;
                const availableWidth = polygonWidthAtY(d.polygon, cy) * (1 - margin);
                visible = textWidth <= availableWidth;
            }
            el.attr("visibility", visible ? "visible" : "hidden");
        });
}
