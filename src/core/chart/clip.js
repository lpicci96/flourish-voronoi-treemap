/**
 * Generate a centered square clipping polygon that fits within the
 * given dimensions, using the shorter side as the square's edge length.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices (counterclockwise).
 */
function squareClip(height, width) {
    const side = Math.min(height, width);
    const offsetX = (width - side) / 2;
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
 * Generate a regular n-sided polygon centered and scaled to fit within
 * the given dimensions. The first vertex is placed at the top.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {number} nSides - Number of polygon sides.
 * @returns {Array<number[]>} Polygon vertices.
 */
function regularPolygonClip(height, width, nSides) {
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

    // Scale to fit available area, center the bounding box
    const scale = Math.min(width / bboxW, height / bboxH);
    const bboxCx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const bboxCy = (Math.min(...ys) + Math.max(...ys)) / 2;

    return unitPoints.map(([x, y]) => [
        width / 2 + (x - bboxCx) * scale,
        height / 2 + (y - bboxCy) * scale
    ]);
}

/**
 * Approximate a circle using a 64-sided regular polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices.
 */
function circularClip(height, width) {
    return regularPolygonClip(height, width, 64);
}

/**
 * Generate an equilateral triangle clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices.
 */
function triangleClip(height, width) {
    return regularPolygonClip(height, width, 3);
}

/**
 * Generate a regular pentagon clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices.
 */
function pentagonClip(height, width) {
    return regularPolygonClip(height, width, 5);
}

/**
 * Generate a regular hexagon clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices.
 */
function hexagonClip(height, width) {
    return regularPolygonClip(height, width, 6);
}

/**
 * Generate a diamond (4-sided regular polygon / rotated square) clipping polygon.
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Polygon vertices.
 */
function diamondClip(height, width) {
    return regularPolygonClip(height, width, 4);
}

/**
 * Return a clipping polygon for the requested shape, scaled to fit the
 * given dimensions.
 * @param {string} shape - Shape identifier (square, rectangle, circle, triangle, pentagon, hexagon, diamond).
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @returns {Array<number[]>} Clipping polygon vertices.
 * @throws {Error} If the shape is not recognised.
 */
export function clipVoronoi(shape, height, width) {

    if (shape === "square") {
        return squareClip(height, width);
    }else if (shape === "rectangle") {
        return rectangularClip(height, width);
    }else if (shape === "circle") {
        return circularClip(height, width);
    }else if (shape === "triangle") {
        return triangleClip(height, width);
    }else if (shape === "pentagon") {
        return pentagonClip(height, width);
    }else if (shape === "hexagon") {
        return hexagonClip(height, width);
    }else if (shape === "diamond") {
        return diamondClip(height, width);
    }else {
        throw new Error("Unknown clip shape: " + shape);
    }
}
