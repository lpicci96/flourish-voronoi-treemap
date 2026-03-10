/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Compute horizontal offset for a shape given its width, the available width,
 * and the desired alignment.
 * @param {number} availableWidth - Total available width.
 * @param {number} shapeWidth - Width of the shape.
 * @param {string} alignment - "left", "center", or "right".
 * @returns {number} Horizontal offset.
 */
function alignOffsetX(availableWidth, shapeWidth, alignment) {
    if (alignment === "left") return 0;
    if (alignment === "right") return availableWidth - shapeWidth;
    return (availableWidth - shapeWidth) / 2; // center
}

/**
 * Generate a square clipping polygon that fits within the
 * given dimensions, using the shorter side as the square's edge length.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices (counterclockwise).
 */
function squareClip(height, width, alignment) {
    const side = Math.min(height, width);
    const offsetX = alignOffsetX(width, side, alignment);
    const offsetY = (height - side) / 2;
    return [[offsetX, offsetY], [offsetX, offsetY + side], [offsetX + side, offsetY + side], [offsetX + side, offsetY]];
}

/**
 * Generate a rectangular clipping polygon spanning the full available area.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices (counterclockwise).
 */
function rectangularClip(height, width) {
    // Clipping polygon (counterclockwise rectangle)
    return [[0, 0], [0, height], [width, height], [width, 0]];
}

/**
 * Generate a regular n-sided polygon scaled to fit within
 * the given dimensions, aligned horizontally as specified.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {number} nSides - Number of polygon sides.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function regularPolygonClip(height, width, nSides, alignment) {
    // Generate unit polygon (r=1) centered at origin, first vertex at top
    const unitPoints = [];
    for (let i = 0; i < nSides; i++) {
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / nSides;
        unitPoints.push([Math.cos(angle), Math.sin(angle)]);
    }

    // Compute bounding box of unit polygon
    const xs = unitPoints.map(p => p[0]);
    const ys = unitPoints.map(p => p[1]);
    const bboxW = Math.max(...xs) - Math.min(...xs);
    const bboxH = Math.max(...ys) - Math.min(...ys);

    // Scale to fit available area
    const scale = Math.min(width / bboxW, height / bboxH);
    const bboxCx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const bboxCy = (Math.min(...ys) + Math.max(...ys)) / 2;

    // Compute the shape's actual width after scaling
    const scaledW = bboxW * scale;
    const offsetX = alignOffsetX(width, scaledW, alignment);
    // shapeCenterX is where the shape center should be placed
    const shapeCenterX = offsetX + scaledW / 2;

    return unitPoints.map(([x, y]) => [
        shapeCenterX + (x - bboxCx) * scale,
        height / 2 + (y - bboxCy) * scale
    ]);
}

/**
 * Approximate a circle using a 64-sided regular polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function circularClip(height, width, alignment) {
    return regularPolygonClip(height, width, 64, alignment);
}

/**
 * Generate an equilateral triangle clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function triangleClip(height, width, alignment) {
    return regularPolygonClip(height, width, 3, alignment);
}

/**
 * Generate a regular pentagon clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function pentagonClip(height, width, alignment) {
    return regularPolygonClip(height, width, 5, alignment);
}

/**
 * Generate a regular hexagon clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function hexagonClip(height, width, alignment) {
    return regularPolygonClip(height, width, 6, alignment);
}

/**
 * Generate a rhombus (4-sided regular polygon / rotated square) clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Polygon vertices.
 */
function rhombusClip(height, width, alignment) {
    return regularPolygonClip(height, width, 4, alignment);
}

/**
 * Return a clipping polygon for the requested shape, scaled to fit the
 * given dimensions and aligned horizontally as specified.
 * @param {string} shape - Shape identifier (square, rectangle, circle, triangle, pentagon, hexagon, diamond).
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {string} [alignment="center"] - Horizontal alignment (left, center, right).
 * @returns {Array<number[]>} Clipping polygon vertices.
 * @throws {Error} If the shape is not recognised.
 */
export function clipVoronoi(shape, height, width, alignment) {
    alignment = alignment || "center";

    if (shape === "square") {
        return squareClip(height, width, alignment);
    }else if (shape === "rectangle") {
        return rectangularClip(height, width);
    }else if (shape === "circle") {
        return circularClip(height, width, alignment);
    }else if (shape === "triangle") {
        return triangleClip(height, width, alignment);
    }else if (shape === "pentagon") {
        return pentagonClip(height, width, alignment);
    }else if (shape === "hexagon") {
        return hexagonClip(height, width, alignment);
    }else if (shape === "rhombus") {
        return rhombusClip(height, width, alignment);
    }else {
        throw new Error("Unknown clip shape: " + shape);
    }
}
