import * as d3 from "d3";

// ── Per-cell path generators ────────────────────────────────────────────

/**
 * Straight polygon path: M...L...L...Z
 */
function straightPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Compute the turn angle at each vertex of a polygon.
 * Returns an array of { theta, isNearCollinear } for each vertex.
 * theta is the interior angle in radians (0–π).
 */
function computeVertexAngles(pts, collinearThreshold) {
    const n = pts.length;
    const angles = new Array(n);
    for (let i = 0; i < n; i++) {
        const a = pts[(i - 1 + n) % n];
        const b = pts[i];
        const c = pts[(i + 1) % n];

        const ux = a[0] - b[0], uy = a[1] - b[1];
        const vx = c[0] - b[0], vy = c[1] - b[1];
        const lu = Math.hypot(ux, uy);
        const lv = Math.hypot(vx, vy);

        if (lu < 1e-6 || lv < 1e-6) {
            angles[i] = { theta: Math.PI, isNearCollinear: true };
            continue;
        }

        const dot = (ux * vx + uy * vy) / (lu * lv);
        const theta = Math.acos(Math.max(-1, Math.min(1, dot)));
        angles[i] = {
            theta,
            isNearCollinear: Math.abs(theta - Math.PI) < collinearThreshold
        };
    }
    return angles;
}

/**
 * Walk along the polygon from vertex `start` in direction `dir` (+1 or -1),
 * summing edge lengths until we reach a vertex that is a real corner
 * (not near-collinear). Returns the total distance available for rounding.
 */
function availableDistance(pts, angles, start, dir) {
    const n = pts.length;
    let dist = 0;
    let i = start;
    // Walk over consecutive near-collinear vertices
    while (true) {
        const next = (i + dir + n) % n;
        const dx = pts[next][0] - pts[i][0];
        const dy = pts[next][1] - pts[i][1];
        dist += Math.hypot(dx, dy);
        // Stop if the next vertex is a real corner (or we've looped back)
        if (!angles[next].isNearCollinear || next === start) break;
        i = next;
    }
    return dist;
}

/**
 * Rounded polygon path using quadratic Bézier curves at each corner.
 * Adapts rounding per-corner based on angle sharpness and edge lengths.
 *
 * Near-collinear vertices (angle ≈ 180°) are passed through as straight
 * line segments. For real corners, the available rounding distance is
 * computed by walking past near-collinear neighbors to find the distance
 * to the next real corner, so short intermediate edges don't bottleneck
 * the rounding.
 */
function roundedPolygonPath(points, {
    baseRadius = 10,
    radiusFn = null,
    maxAngleFactor = 2.5,
    convexOnly = false,
    collinearThreshold = 0.15
} = {}) {
    if (!points || points.length < 3) return "";

    const n0 = points.length;
    const pts =
        points[0][0] === points[n0 - 1][0] && points[0][1] === points[n0 - 1][1]
            ? points.slice(0, -1)
            : points.slice();
    const n = pts.length;

    const angles = computeVertexAngles(pts, collinearThreshold);
    const path = d3.path();

    const cutPoint = (a, b, t) => {
        const dx = a[0] - b[0], dy = a[1] - b[1];
        const L = Math.hypot(dx, dy) || 1;
        return [b[0] + (dx / L) * t, b[1] + (dy / L) * t];
    };

    const cuts = new Array(n);
    for (let i = 0; i < n; i++) {
        const b = pts[i];

        // Near-collinear vertices: pass through, no rounding
        if (angles[i].isNearCollinear) {
            cuts[i] = { inPt: b, outPt: b, vertex: b, passThrough: true };
            continue;
        }

        const a = pts[(i - 1 + n) % n];
        const c = pts[(i + 1) % n];

        const ux = a[0] - b[0], uy = a[1] - b[1];
        const vx = c[0] - b[0], vy = c[1] - b[1];
        const crossZ = ux * vy - uy * vx;
        const isConvex = crossZ < 0;

        if (convexOnly && !isConvex) {
            cuts[i] = { inPt: b, outPt: b, vertex: b, passThrough: true };
            continue;
        }

        const { theta } = angles[i];
        const r = Math.max(0, radiusFn ? +radiusFn(i, b, a, c) : baseRadius);
        const angleFactor = Math.min(maxAngleFactor, Math.PI / Math.max(theta, 0.01));
        const desired = r * angleFactor;

        // Walk past near-collinear neighbors to find available distance
        const distIn = availableDistance(pts, angles, i, -1);
        const distOut = availableDistance(pts, angles, i, +1);

        const tIn = Math.min(desired, distIn / 1.5);
        const tOut = Math.min(desired, distOut / 1.5);

        cuts[i] = {
            inPt: cutPoint(a, b, tIn),
            outPt: cutPoint(c, b, tOut),
            vertex: b,
            passThrough: false
        };
    }

    // Build path
    const firstCut = cuts[0];
    const startPt = firstCut.passThrough ? firstCut.vertex : firstCut.inPt;
    path.moveTo(startPt[0], startPt[1]);

    for (let i = 0; i < n; i++) {
        const { inPt, outPt, vertex, passThrough } = cuts[i];
        if (passThrough) {
            path.lineTo(vertex[0], vertex[1]);
        } else {
            path.lineTo(inPt[0], inPt[1]);
            path.quadraticCurveTo(vertex[0], vertex[1], outPt[0], outPt[1]);
        }
    }
    path.closePath();
    return path.toString();
}

// ── Single dispatcher for per-cell paths ────────────────────────────────

/**
 * Return an SVG path `d` string for a single polygon.
 * This is the sole style dispatcher — all style-specific logic lives here.
 * @param {Array<number[]>} polygon - Array of coordinate pairs.
 * @param {string} [style="straight"] - Border rounding style.
 * @param {number} [roundingSize] - Rounding radius in pixels.
 * @param {number} [maxAngleFactor=2.5] - Cap for extra rounding on sharp angles (adaptive only).
 * @returns {string} SVG path data string.
 */
export function borderPath(polygon, style, roundingSize, maxAngleFactor) {
    style = style || "straight";

    if (style === "straight") {
        return straightPath(polygon);
    } else if (style === "rounded") {
        return roundedPolygonPath(polygon, { baseRadius: roundingSize, maxAngleFactor: 1 });
    } else if (style === "adaptive") {
        return roundedPolygonPath(polygon, {
            baseRadius: roundingSize,
            maxAngleFactor: maxAngleFactor || 2.5
        });
    } else {
        throw new Error("Unknown border rounding style: " + style);
    }
}

// ── Combined path for all cells ─────────────────────────────────────────

/**
 * Canonical edge key so [A,B] and [B,A] produce the same string.
 */
function edgeKey(a, b) {
    if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
        return a[0] + "," + a[1] + "-" + b[0] + "," + b[1];
    }
    return b[0] + "," + b[1] + "-" + a[0] + "," + a[1];
}

/**
 * Deduplicated straight edges as individual M...L segments.
 */
function deduplicatedEdgePath(polygons) {
    const seen = new Set();
    const parts = [];
    for (const polygon of polygons) {
        const n = polygon.length;
        for (let i = 0; i < n; i++) {
            const a = polygon[i];
            const b = polygon[(i + 1) % n];
            const key = edgeKey(a, b);
            if (!seen.has(key)) {
                seen.add(key);
                parts.push("M" + a[0] + "," + a[1] + "L" + b[0] + "," + b[1]);
            }
        }
    }
    return parts.join("");
}

/**
 * Build a single combined SVG path for all cell borders.
 * Straight borders use edge deduplication (each shared edge drawn once).
 * Other styles concatenate per-cell paths via borderPath.
 * @param {Array<Array<number[]>>} polygons - All cell polygons.
 * @param {string} [style="straight"] - Border rounding style.
 * @param {number} [roundingSize] - Rounding radius.
 * @param {number} [maxAngleFactor] - Cap for extra rounding on sharp angles.
 * @returns {string} SVG path data string.
 */
export function combinedBorderPath(polygons, style, roundingSize, maxAngleFactor) {
    style = style || "straight";

    if (style === "straight") {
        return deduplicatedEdgePath(polygons);
    }

    return polygons.map(polygon => borderPath(polygon, style, roundingSize, maxAngleFactor)).join("");
}