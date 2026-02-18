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

const LINE_HEIGHT = 1.2; // line height in em units

/**
 * Measure the pixel width of a string by temporarily setting it on a text element.
 * @param {SVGTextElement} textNode - The SVG text element to use for measurement.
 * @param {string} str - The string to measure.
 * @returns {number} The computed text length in pixels.
 */
function measureText(textNode, str) {
    textNode.textContent = str;
    return textNode.getComputedTextLength();
}

/**
 * Wrap text into lines that fit within the polygon at each line's y-position.
 * @param {SVGTextElement} textNode - The SVG text element (used for measuring).
 * @param {string} text - The full label text.
 * @param {Array<number[]>} polygon - The polygon coordinates.
 * @param {number} cx - Centroid x.
 * @param {number} cy - Centroid y.
 * @param {number} lineHeightPx - Line height in pixels.
 * @param {number} margin - Margin fraction (0–1) to shrink available width.
 * @returns {string[]} Array of line strings.
 */
function wrapText(textNode, text, polygon, cx, cy, lineHeightPx, margin) {
    const words = text.split(/\s+/);
    if (words.length <= 1) return [text];

    // Try wrapping into increasing number of lines to find the best fit
    const marginFactor = 1 - (margin || 0);

    // Greedy line-breaking: build lines that fit the available width at each y-position
    // First estimate how many lines we might need based on single-line overflow
    const singleLineWidth = measureText(textNode, text);
    const centroidWidth = polygonWidthAtY(polygon, cy) * marginFactor;
    if (singleLineWidth <= centroidWidth) return [text];

    const lines = [];
    let currentLine = words[0];

    for (let w = 1; w < words.length; w++) {
        const testLine = currentLine + " " + words[w];
        const testWidth = measureText(textNode, testLine);

        // Estimate y-position for the current line to get available width
        const numLinesSoFar = lines.length + 1;
        const estimatedTotalLines = Math.ceil(words.length / Math.max(1, w / numLinesSoFar));
        const lineY = cy + (lines.length - (estimatedTotalLines - 1) / 2) * lineHeightPx;
        const availableWidth = polygonWidthAtY(polygon, lineY) * marginFactor;

        if (testWidth > availableWidth && availableWidth > 0) {
            lines.push(currentLine);
            currentLine = words[w];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    return lines;
}

/**
 * Render text labels for Voronoi treemap leaves.
 * @param {SVGElement} container - Target SVG DOM element.
 * @param {Array} leaves - Hierarchy leaves with valid polygons.
 * @param {object} labelSettings - Label settings ({ show_labels }).
 */
export function renderLabels(container, leaves, labelSettings, animation_duration) {
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

    const shouldWrap = labelSettings.wrap_labels !== false;
    const margin = labelSettings.hide_margin != null ? labelSettings.hide_margin : 0;
    const duration = animation_duration || 0;

    const labels = g.selectAll("text")
        .data(leaves, d => d.data.name);

    // EXIT
    labels.exit().remove();

    // ENTER
    const enter = labels.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none");

    if (duration > 0) {
        enter.attr("opacity", 0);
    }

    // ENTER + UPDATE
    const merged = enter.merge(labels);

    merged
        .attr("font-weight", labelSettings.font_weight)
        .each(function(d, i) {
            const [cx, cy] = polygonCentroid(d.polygon);
            const fontSizeEm = sizeProportionally
                ? minSize + (maxSize - minSize) * Math.sqrt(areas[i] / maxArea)
                : (labelSettings.font_size || 0.8);
            const el = d3.select(this);

            // Store previous centroid for transitioning
            const prevCx = el.attr("data-cx") != null ? +el.attr("data-cx") : cx;
            const prevCy = el.attr("data-cy") != null ? +el.attr("data-cy") : cy;
            el.attr("data-cx", cx).attr("data-cy", cy);

            // Set font size first so measurements are accurate
            el.attr("font-size", fontSizeEm + "em")
                .attr("fill", labelSettings.font_color);

            // Apply text outline
            if (labelSettings.show_outline) {
                const outlineSize = labelSettings.outline_size != null ? labelSettings.outline_size : 0.3;
                el.attr("stroke", labelSettings.outline_color || "#ffffff")
                    .attr("stroke-width", outlineSize + "em")
                    .attr("stroke-linejoin", "round")
                    .attr("paint-order", "stroke");
            } else {
                el.attr("stroke", "none")
                    .attr("stroke-width", null)
                    .attr("stroke-linejoin", null)
                    .attr("paint-order", null);
            }

            // Compute the pixel line height from the font size
            const computedStyle = window.getComputedStyle(this);
            const fontSizePx = parseFloat(computedStyle.fontSize) || 12;
            const lineHeightPx = fontSizePx * LINE_HEIGHT;

            // Clear existing content
            el.text(null).selectAll("tspan").remove();

            // Determine lines (wrap or single)
            let lines;
            if (shouldWrap) {
                this.textContent = d.data.name;
                lines = wrapText(this, d.data.name, d.polygon, cx, cy, lineHeightPx, margin);
                this.textContent = "";
            } else {
                lines = [d.data.name];
            }

            // Compute y-offsets so the text block is vertically centered at the centroid
            const totalHeight = (lines.length - 1) * lineHeightPx;
            const startY = cy - totalHeight / 2;

            // Determine label visibility
            let visible = true;
            if (showList && showList.size > 0) {
                visible = showList.has(d.data.name);
            } else if (labelSettings.hide_small_labels) {
                const marginFactor = 1 - margin;
                visible = lines.every(function(line, lineIndex) {
                    const lineY = startY + lineIndex * lineHeightPx;
                    const availableWidth = polygonWidthAtY(d.polygon, lineY) * marginFactor;
                    const tspanTemp = el.append("tspan").text(line);
                    const lineWidth = tspanTemp.node().getComputedTextLength();
                    tspanTemp.remove();
                    return lineWidth <= availableWidth;
                });
            }
            el.attr("visibility", visible ? "visible" : "hidden");

            if (duration > 0 && (prevCx !== cx || prevCy !== cy)) {
                // Create tspans at old positions first
                const prevStartY = prevCy - totalHeight / 2;
                lines.forEach(function(line, lineIndex) {
                    el.append("tspan")
                        .attr("x", prevCx)
                        .attr("y", prevStartY + lineIndex * lineHeightPx)
                        .attr("dominant-baseline", "central")
                        .text(line);
                });

                // Transition each tspan to new position
                el.selectAll("tspan").each(function(_, lineIndex) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .ease(d3.easeCubicInOut)
                        .attr("x", cx)
                        .attr("y", startY + lineIndex * lineHeightPx);
                });

                // Fade in entering labels
                el.transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .attr("opacity", 1);
            } else {
                // No animation: set positions immediately
                lines.forEach(function(line, lineIndex) {
                    el.append("tspan")
                        .attr("x", cx)
                        .attr("y", startY + lineIndex * lineHeightPx)
                        .attr("dominant-baseline", "central")
                        .text(line);
                });

                el.attr("opacity", 1);
            }
        });
}
