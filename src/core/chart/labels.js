import * as d3 from "d3";
import { getBaseColor, isPaleColor } from "./colors";

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
 * Ray-casting point-in-polygon test.
 * @param {number} px - Test point x.
 * @param {number} py - Test point y.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @returns {boolean} True if point is inside the polygon.
 */
function pointInPolygon(px, py, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * Minimum signed distance from a point to the polygon boundary.
 * Positive if inside, negative if outside.
 * @param {number} px - Test point x.
 * @param {number} py - Test point y.
 * @param {Array<{ax:number,ay:number,bx:number,by:number}>} edges - Pre-computed edges.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @returns {number} Signed distance to nearest edge.
 */
function pointToPolygonSignedDist(px, py, edges, polygon) {
    let minDist = Infinity;
    for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const dx = e.bx - e.ax, dy = e.by - e.ay;
        const lenSq = dx * dx + dy * dy;
        let t = lenSq > 0 ? ((px - e.ax) * dx + (py - e.ay) * dy) / lenSq : 0;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const cx = e.ax + t * dx - px, cy = e.ay + t * dy - py;
        const dist = Math.sqrt(cx * cx + cy * cy);
        if (dist < minDist) minDist = dist;
    }
    return pointInPolygon(px, py, polygon) ? minDist : -minDist;
}

/**
 * Area-weighted centroid using the shoelace cross-product approach.
 * Falls back to vertex-average centroid for degenerate polygons.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @returns {number[]} [cx, cy] centroid coordinates.
 */
function polygonAreaCentroid(polygon) {
    let cx = 0, cy = 0, area = 0;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const cross = polygon[j][0] * polygon[i][1] - polygon[i][0] * polygon[j][1];
        cx += (polygon[j][0] + polygon[i][0]) * cross;
        cy += (polygon[j][1] + polygon[i][1]) * cross;
        area += cross;
    }
    if (Math.abs(area) < 1e-10) return polygonCentroid(polygon);
    area /= 2;
    const factor = 1 / (6 * area);
    return [cx * factor, cy * factor];
}

/**
 * Compute the pole of inaccessibility — the center of the largest inscribed circle.
 * Uses an iterative grid-subdivision approach with a max-heap priority queue.
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} precision - Convergence threshold in pixels (default 1).
 * @returns {{x: number, y: number, distance: number}} Pole coordinates and inscribed circle radius.
 */
function poleOfInaccessibility(polygon, precision) {
    precision = precision || 1;
    const n = polygon.length;

    // Bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < n; i++) {
        if (polygon[i][0] < minX) minX = polygon[i][0];
        if (polygon[i][1] < minY) minY = polygon[i][1];
        if (polygon[i][0] > maxX) maxX = polygon[i][0];
        if (polygon[i][1] > maxY) maxY = polygon[i][1];
    }

    const width = maxX - minX, height = maxY - minY;
    const cellSize = Math.min(width, height);

    if (cellSize === 0) {
        return { x: minX, y: minY, distance: 0 };
    }

    // Pre-compute edges
    var edges = [];
    for (let i = 0, j = n - 1; i < n; j = i++) {
        edges.push({ ax: polygon[j][0], ay: polygon[j][1], bx: polygon[i][0], by: polygon[i][1] });
    }

    // Inline binary max-heap keyed on cell.max
    var heap = [];
    function heapPush(cell) {
        heap.push(cell);
        var i = heap.length - 1;
        while (i > 0) {
            var parent = (i - 1) >> 1;
            if (heap[parent].max >= heap[i].max) break;
            var tmp = heap[parent]; heap[parent] = heap[i]; heap[i] = tmp;
            i = parent;
        }
    }
    function heapPop() {
        var top = heap[0];
        var last = heap.pop();
        if (heap.length > 0) {
            heap[0] = last;
            var i = 0, len = heap.length;
            while (true) {
                var left = 2 * i + 1, right = 2 * i + 2, largest = i;
                if (left < len && heap[left].max > heap[largest].max) largest = left;
                if (right < len && heap[right].max > heap[largest].max) largest = right;
                if (largest === i) break;
                var tmp = heap[i]; heap[i] = heap[largest]; heap[largest] = tmp;
                i = largest;
            }
        }
        return top;
    }

    function makeCell(x, y, half) {
        var dist = pointToPolygonSignedDist(x, y, edges, polygon);
        return { x: x, y: y, half: half, dist: dist, max: dist + half * Math.SQRT2 };
    }

    // Seed grid cells
    var half = cellSize / 2;
    for (var x = minX; x < maxX; x += cellSize) {
        for (var y = minY; y < maxY; y += cellSize) {
            heapPush(makeCell(x + half, y + half, half));
        }
    }

    // Seed with vertex-average and area-weighted centroids
    var vc = polygonCentroid(polygon);
    var bestCell = makeCell(vc[0], vc[1], 0);

    var ac = polygonAreaCentroid(polygon);
    var acCell = makeCell(ac[0], ac[1], 0);
    if (acCell.dist > bestCell.dist) bestCell = acCell;

    while (heap.length > 0) {
        var cell = heapPop();

        // Update best if this cell center is better
        if (cell.dist > bestCell.dist) bestCell = cell;

        // Prune: if upper bound can't beat current best by more than precision, stop
        if (cell.max - bestCell.dist <= precision) break;

        // Subdivide
        half = cell.half / 2;
        heapPush(makeCell(cell.x - half, cell.y - half, half));
        heapPush(makeCell(cell.x + half, cell.y - half, half));
        heapPush(makeCell(cell.x - half, cell.y + half, half));
        heapPush(makeCell(cell.x + half, cell.y + half, half));
    }

    return { x: bestCell.x, y: bestCell.y, distance: bestCell.dist };
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
export function renderLabels(container, leaves, labelSettings, animation_duration, hierarchy, colors, colorSettings) {
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

    function getLabelText(d) {
        if (d.data._row && d.data._row.label_override != null) {
            return String(d.data._row.label_override);
        }
        return d.data.name;
    }

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
    const valueLabelSize = labelSettings.value_label_size != null ? labelSettings.value_label_size : 0.85;
    const valueLabelOpacity = labelSettings.value_label_opacity != null ? labelSettings.value_label_opacity : 0.8;
    const valueLabelWeight = labelSettings.value_label_weight || "normal";

    const labels = g.selectAll("text")
        .data(leaves, d => d.data.name);

    // EXIT
    if (duration > 0) {
        labels.exit()
            .transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .attr("opacity", 0)
            .remove();
    } else {
        labels.exit().remove();
    }

    // ENTER
    const enter = labels.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none");


    // ENTER + UPDATE
    const merged = enter.merge(labels);

    merged
        .attr("font-weight", labelSettings.font_weight)
        .each(function(d, i) {
            const pole = poleOfInaccessibility(d.polygon, 1);
            const cx = pole.x, cy = pole.y, inscribedRadius = pole.distance;
            const fontSizeEm = sizeProportionally
                ? minSize + (maxSize - minSize) * Math.sqrt(areas[i] / maxArea)
                : (labelSettings.font_size || 0.8);
            const el = d3.select(this);

            // Store previous centroid for transitioning
            const prevCx = el.attr("data-cx") != null ? +el.attr("data-cx") : cx;
            const prevCy = el.attr("data-cy") != null ? +el.attr("data-cy") : cy;
            el.attr("data-cx", cx).attr("data-cy", cy);

            // Determine label fill and outline colors
            var fillColor = labelSettings.font_color;
            var outlineColor = labelSettings.outline_color || "#ffffff";
            if (labelSettings.auto_contrast && hierarchy && colors) {
                var baseColor = getBaseColor(d, hierarchy, colors);
                var pale = isPaleColor(baseColor);
                fillColor = pale ? "#000000" : "#ffffff";
                outlineColor = pale ? "#ffffff" : "#000000";
            }

            // Set font size first so measurements are accurate
            el.attr("font-size", fontSizeEm + "em")
                .attr("fill", fillColor);

            // Apply text outline
            if (labelSettings.show_outline) {
                const outlineSize = labelSettings.outline_size != null ? labelSettings.outline_size : 0.3;
                el.attr("stroke", outlineColor)
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
                this.textContent = getLabelText(d);
                lines = wrapText(this, getLabelText(d), d.polygon, cx, cy, lineHeightPx, margin);
                this.textContent = "";
            } else {
                lines = [getLabelText(d)];
            }

            // Optionally append value line if there is enough vertical space
            let valueLineStart = -1;
            if (labelSettings.show_value_labels && d._formattedValue != null) {
                const nameLineCount = lines.length;

                // Wrap value text if wrapping is enabled
                var valueLines;
                if (shouldWrap) {
                    // Temporarily set the smaller value font size for accurate measurement
                    var prevFontSize = this.style.fontSize;
                    this.style.fontSize = (fontSizePx * valueLabelSize) + "px";
                    this.textContent = d._formattedValue;
                    valueLines = wrapText(this, d._formattedValue, d.polygon, cx, cy, lineHeightPx, margin);
                    this.textContent = "";
                    this.style.fontSize = prevFontSize;
                } else {
                    valueLines = [d._formattedValue];
                }

                const totalWithValue = nameLineCount + valueLines.length;
                const neededHeight = (totalWithValue - 1) * lineHeightPx;
                // Check if the inscribed circle diameter can fit all lines
                if (inscribedRadius * 2 >= neededHeight + fontSizePx) {
                    valueLineStart = lines.length;
                    valueLines.forEach(function(vl) { lines.push(vl); });
                }
            }

            // Compute y-offsets so the text block is vertically centered at the centroid
            let totalHeight = (lines.length - 1) * lineHeightPx;
            let startY = cy - totalHeight / 2;

            // Check whether all lines fit within the polygon
            function checkLinesFit(linesToCheck, blockStartY, halfFont, marginFactor) {
                return linesToCheck.every(function(line, lineIndex) {
                    const lineY = blockStartY + lineIndex * lineHeightPx;
                    // Sample polygon width at the top, center, and bottom of the text line
                    const widthTop = polygonWidthAtY(d.polygon, lineY - halfFont);
                    const widthCenter = polygonWidthAtY(d.polygon, lineY);
                    const widthBottom = polygonWidthAtY(d.polygon, lineY + halfFont);
                    const availableWidth = Math.min(widthTop, widthCenter, widthBottom) * marginFactor;
                    if (availableWidth <= 0) return false;
                    const tspanTemp = el.append("tspan").text(line);
                    const lineWidth = tspanTemp.node().getComputedTextLength();
                    tspanTemp.remove();
                    return lineWidth <= availableWidth;
                });
            }

            // Determine label visibility
            let visible = true;
            if (showList && showList.size > 0) {
                visible = showList.has(d.data.name);
            } else if (labelSettings.hide_small_labels) {
                const marginFactor = 1 - margin;
                // Quick reject: cell too small to fit a single line of text
                if (inscribedRadius * 2 * marginFactor < fontSizePx) {
                    visible = false;
                } else {
                    const halfFont = fontSizePx / 2;
                    visible = checkLinesFit(lines, startY, halfFont, marginFactor);

                    // If check failed and value lines were added, retry with name lines only
                    if (!visible && valueLineStart >= 0) {
                        lines.length = valueLineStart;
                        valueLineStart = -1;
                        totalHeight = (lines.length - 1) * lineHeightPx;
                        startY = cy - totalHeight / 2;
                        visible = checkLinesFit(lines, startY, halfFont, marginFactor);
                    }
                }
            }
            el.attr("visibility", visible ? "visible" : "hidden");

            if (duration > 0 && (prevCx !== cx || prevCy !== cy)) {
                // Create tspans at old positions first
                const prevStartY = prevCy - totalHeight / 2;
                lines.forEach(function(line, lineIndex) {
                    var tspan = el.append("tspan")
                        .attr("x", prevCx)
                        .attr("y", prevStartY + lineIndex * lineHeightPx)
                        .attr("dominant-baseline", "central")
                        .text(line);
                    if (valueLineStart >= 0 && lineIndex >= valueLineStart) {
                        tspan.attr("font-size", valueLabelSize + "em").attr("opacity", valueLabelOpacity).attr("font-weight", valueLabelWeight);
                    }
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
                    var tspan = el.append("tspan")
                        .attr("x", cx)
                        .attr("y", startY + lineIndex * lineHeightPx)
                        .attr("dominant-baseline", "central")
                        .text(line);
                    if (valueLineStart >= 0 && lineIndex >= valueLineStart) {
                        tspan.attr("font-size", valueLabelSize + "em").attr("opacity", valueLabelOpacity).attr("font-weight", valueLabelWeight);
                    }
                });

                el.attr("opacity", 1);
            }
        });
}
