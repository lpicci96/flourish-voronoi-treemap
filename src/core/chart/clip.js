// TODO: Add square clip (equal width and height)

function rectangularClip(height, width) {
    // Clipping polygon (counterclockwise rectangle)
    return [[0, 0], [0, height], [width, height], [width, 0]];
}

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

function circularClip(height, width) {
    return regularPolygonClip(height, width, 64);
}

function triangleClip(height, width) {
    return regularPolygonClip(height, width, 3);
}

function pentagonClip(height, width) {
    return regularPolygonClip(height, width, 5);
}

function hexagonClip(height, width) {
    return regularPolygonClip(height, width, 6);
}

function diamondClip(height, width) {
    return regularPolygonClip(height, width, 4);
}

export function clipVoronoi(shape, height, width) {

    if (shape === "rectangle") {
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