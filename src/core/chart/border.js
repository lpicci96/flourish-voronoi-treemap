// ── Polygon inset ───────────────────────────────────────────────────────

/**
 * Inset a convex polygon inward by `amount` pixels.
 * Each edge is offset inward by `amount / 2` (so two adjacent cells
 * produce a full `amount` gap between them). Consecutive offset edges
 * are intersected to obtain new vertices.
 *
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} amount - Total gap size in pixels.
 * @returns {Array<number[]>} Inset polygon (array of [x, y] pairs).
 */
export function insetPolygon(polygon, amount) {
    if (!polygon || polygon.length < 3 || !amount) return polygon;

    const half = amount / 2;
    const n = polygon.length;

    // Determine winding via signed area (shoelace formula).
    // In screen coords (y-down): positive = clockwise, negative = counter-clockwise.
    let signedArea2 = 0;
    for (let i = 0; i < n; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % n];
        signedArea2 += (a[0] * b[1] - b[0] * a[1]);
    }
    // In screen coords (y-down): positive area = CCW, inward normal = (-dy, dx)
    // negative area = CW, inward normal = (dy, -dx)
    const sign = signedArea2 > 0 ? -1 : 1;

    // Compute inward-offset edges
    const edges = [];
    for (let i = 0; i < n; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % n];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.hypot(dx, dy);
        if (len < 1e-10) continue;
        // Inward normal: CW → (dy, -dx), CCW → (-dy, dx)
        const nx = sign * dy / len;
        const ny = sign * -dx / len;
        edges.push({
            ax: a[0] + nx * half,
            ay: a[1] + ny * half,
            bx: b[0] + nx * half,
            by: b[1] + ny * half
        });
    }

    if (edges.length < 3) return polygon;

    // Intersect consecutive offset edges to get inset vertices
    const result = [];
    for (let i = 0; i < edges.length; i++) {
        const e1 = edges[i];
        const e2 = edges[(i + 1) % edges.length];
        const pt = lineLineIntersection(
            e1.ax, e1.ay, e1.bx, e1.by,
            e2.ax, e2.ay, e2.bx, e2.by
        );
        if (pt) {
            result.push(pt);
        }
    }

    return result.length >= 3 ? result : polygon;
}

/**
 * Intersect two lines (not segments) defined by two points each.
 * Returns [x, y] or null if parallel.
 */
function lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 1e-10) return null;
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
}

// ── Per-cell path generators ────────────────────────────────────────────

/**
 * Straight polygon path: M...L...L...Z
 */
function straightPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Rounded polygon path using quadratic Bézier curves at each corner.
 * The original vertex becomes the Bézier control point, guaranteeing
 * tangent continuity with both adjacent edges. Near-straight vertices
 * naturally produce near-straight curves with no special-case logic.
 *
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} radius - Maximum cutback distance from each vertex (px).
 * @param {number} reach - Max fraction of each edge that rounding can consume (0–1).
 * @returns {string} SVG path data string with L and Q commands.
 */
function roundedPath(polygon, radius, reach) {
    if (!polygon || polygon.length < 3) return straightPath(polygon);

    var n = polygon.length;

    // Precompute edge lengths
    var edgeLens = new Array(n);
    for (var i = 0; i < n; i++) {
        var a = polygon[i];
        var b = polygon[(i + 1) % n];
        edgeLens[i] = Math.hypot(b[0] - a[0], b[1] - a[1]);
    }

    // For each vertex, compute cutback along incoming and outgoing edges.
    // lenIn = length of edge from prev→curr (edge index: (i-1+n)%n)
    // lenOut = length of edge from curr→next (edge index: i)
    var inPts = new Array(n);
    var outPts = new Array(n);

    for (var i = 0; i < n; i++) {
        var prev = polygon[(i - 1 + n) % n];
        var curr = polygon[i];
        var next = polygon[(i + 1) % n];

        var lenIn = edgeLens[(i - 1 + n) % n];
        var lenOut = edgeLens[i];

        var cutIn = lenIn > 0 ? Math.min(radius, lenIn * reach) : 0;
        var cutOut = lenOut > 0 ? Math.min(radius, lenOut * reach) : 0;

        inPts[i] = cutIn > 0
            ? [curr[0] + (prev[0] - curr[0]) / lenIn * cutIn,
               curr[1] + (prev[1] - curr[1]) / lenIn * cutIn]
            : curr;

        outPts[i] = cutOut > 0
            ? [curr[0] + (next[0] - curr[0]) / lenOut * cutOut,
               curr[1] + (next[1] - curr[1]) / lenOut * cutOut]
            : curr;
    }

    // Build path: L to inPt, Q through vertex to outPt
    var d = "M" + inPts[0][0] + "," + inPts[0][1];
    for (var i = 0; i < n; i++) {
        var curr = polygon[i];
        d += "L" + inPts[i][0] + "," + inPts[i][1];
        d += "Q" + curr[0] + "," + curr[1] + "," + outPts[i][0] + "," + outPts[i][1];
    }
    d += "Z";
    return d;
}

// ── Single dispatcher ───────────────────────────────────────────────────

/**
 * Return an SVG path `d` string for a single polygon.
 * @param {Array<number[]>} polygon - Array of coordinate pairs.
 * @param {string} [style="straight"] - Border rounding style.
 * @param {number} [gap=0] - Resolved gap size in pixels (polygon is inset by gap/2).
 * @param {number} [radiusPx=0] - Rounding radius in pixels.
 * @param {number} [reach=0.45] - Max fraction of each edge consumed by rounding.
 * @returns {string} SVG path data string.
 */
export function borderPath(polygon, style, gap, radiusPx, reach) {
    style = style || "straight";
    var inset = gap ? insetPolygon(polygon, gap) : polygon;

    if (style === "adaptive" && radiusPx > 0) {
        return roundedPath(inset, radiusPx, reach || 0.45);
    }
    return straightPath(inset);
}
