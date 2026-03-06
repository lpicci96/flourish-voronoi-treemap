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
 * Closed cubic B-spline path from an array of control points.
 * Produces C2-continuous curves — curvature transitions are smooth
 * everywhere, eliminating the visible kinks that quadratic Bézier
 * curves produce at the junction between straight and curved segments.
 *
 * Each segment j uses control points P[j-1], P[j], P[j+1], P[j+2]
 * (indices mod m) and is converted to a cubic Bézier (C command).
 *
 * @param {Array<number[]>} pts - Control points.
 * @returns {string} SVG path data string.
 */
function basisClosedPath(pts) {
    var m = pts.length;
    if (m < 3) return straightPath(pts);

    function P(i) { return pts[((i % m) + m) % m]; }

    var pm1 = P(-1), p0 = P(0), p1 = P(1);
    var d = "M" + ((pm1[0] + 4 * p0[0] + p1[0]) / 6) + "," +
                  ((pm1[1] + 4 * p0[1] + p1[1]) / 6);

    for (var j = 0; j < m; j++) {
        var pj = P(j);
        var pn = P(j + 1);
        var pn2 = P(j + 2);

        d += "C" +
            ((2 * pj[0] + pn[0]) / 3) + "," + ((2 * pj[1] + pn[1]) / 3) + "," +
            ((pj[0] + 2 * pn[0]) / 3) + "," + ((pj[1] + 2 * pn[1]) / 3) + "," +
            ((pj[0] + 4 * pn[0] + pn2[0]) / 6) + "," + ((pj[1] + 4 * pn[1] + pn2[1]) / 6);
    }

    d += "Z";
    return d;
}

/**
 * Rounded polygon path using straight edges and quadratic Bézier corners.
 *
 * For each edge, cutback points are placed at `radius` distance (or
 * `reach` fraction of edge length, whichever is smaller) from each vertex.
 * Straight L segments run along the edge between cutback points, and
 * Q curves round each corner using the vertex as the control point.
 *
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} radius - Maximum cutback distance from each vertex (px).
 * @param {number} reach - Max fraction of each edge that rounding can consume (0–0.5).
 * @returns {string} SVG path data string.
 */
function roundedPath(polygon, radius, reach) {
    if (!polygon || polygon.length < 3) return straightPath(polygon);
    var n = polygon.length;

    // For each edge, compute depart (near start) and arrive (near end) points
    var edges = [];
    for (var i = 0; i < n; i++) {
        var a = polygon[i];
        var b = polygon[(i + 1) % n];
        var len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        var cut = len > 0 ? Math.min(radius, len * reach) : 0;
        var t = len > 0 ? cut / len : 0;
        edges.push({
            dx: a[0] + (b[0] - a[0]) * t,
            dy: a[1] + (b[1] - a[1]) * t,
            ax: b[0] + (a[0] - b[0]) * t,
            ay: b[1] + (a[1] - b[1]) * t
        });
    }

    // Start at depart point of first edge
    var d = "M" + edges[0].dx + "," + edges[0].dy;

    for (var i = 0; i < n; i++) {
        var nextI = (i + 1) % n;
        var edge = edges[i];
        var nextEdge = edges[nextI];
        var vertex = polygon[nextI];

        // Straight line along edge to arrive point
        d += "L" + edge.ax + "," + edge.ay;
        // Quadratic Bézier around corner vertex
        d += "Q" + vertex[0] + "," + vertex[1] + " " + nextEdge.dx + "," + nextEdge.dy;
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
