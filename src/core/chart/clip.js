

function rectangularClip(height, width) {
    // Clipping polygon (counterclockwise rectangle)
    return [[0, 0], [0, height], [width, height], [width, 0]];
}

function circularClip(height, width, nPoints = 64) {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy);
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        const angle = (2 * Math.PI * i) / nPoints;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return points;
}

export function clipVoronoi(shape, height, width) {

    if (shape === "rectangle") {
        return rectangularClip(height, width);
    }else if (shape === "circle") {
        return circularClip(height, width);
    }else {
        throw new Error("Unknown clip shape: " + shape);
    }
}