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
 * Rounded polygon path using straight edges and quadratic Bézier corners.
 *
 * For each edge, cutback points are placed at `radius` distance (or
 * `reach` fraction of edge length, whichever is smaller) from each vertex.
 * Straight L segments run along the edge between cutback points, and
 * Q curves round each corner using the vertex as the control point.
 *
 * When a Voronoi edge is too short for effective rounding (shorter than
 * half the radius), the two Q corners flanking it are merged into a
 * single cubic Bézier that uses both original vertices as control points.
 * This keeps every vertex in the path while placing curve endpoints on
 * the adjacent long edges where the cutback is large enough for smooth
 * rounding.
 *
 * @param {Array<number[]>} polygon - Array of [x, y] coordinate pairs.
 * @param {number} radius - Maximum cutback distance from each vertex (px).
 * @param {number} reach - Max fraction of each edge that rounding can consume (0–0.5).
 * @returns {string} SVG path data string.
 */
function roundedPath(polygon, radius, reach) {
    if (!polygon || polygon.length < 3) return straightPath(polygon);
    var n = polygon.length;
    var minEdge = radius * 0.5;

    // For each edge, compute depart (near start), arrive (near end), and length
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
            ay: b[1] + (a[1] - b[1]) * t,
            len: len
        });
    }

    // Find a starting edge that is not short so merges don't wrap the start
    var start = 0;
    for (var s = 0; s < n; s++) {
        if (edges[s].len >= minEdge) { start = s; break; }
    }

    var d = "M" + edges[start].dx + "," + edges[start].dy;

    var processed = 0;
    var i = start;
    while (processed < n) {
        var edge = edges[i];
        var nextI = (i + 1) % n;
        var nextEdge = edges[nextI];
        var vertex = polygon[nextI];

        // Straight line along edge to arrive point
        d += "L" + edge.ax + "," + edge.ay;

        // Check if the next edge is too short for effective rounding
        if (nextEdge.len >= minEdge || processed >= n - 1) {
            // Normal: quadratic Bézier around corner vertex
            d += "Q" + vertex[0] + "," + vertex[1] + " " + nextEdge.dx + "," + nextEdge.dy;
            i = nextI;
            processed++;
        } else {
            var afterI = (nextI + 1) % n;
            var afterEdge = edges[afterI];
            // Single short edge followed by a long edge: merge both corners
            // into one cubic Bézier that keeps both vertices as control points
            if (afterEdge.len >= minEdge || processed >= n - 2) {
                var afterVertex = polygon[afterI];
                d += "C" + vertex[0] + "," + vertex[1] + " " +
                     afterVertex[0] + "," + afterVertex[1] + " " +
                     afterEdge.dx + "," + afterEdge.dy;
                i = afterI;
                processed += 2;
            } else {
                // Chain of short edges: fall back to normal Q
                d += "Q" + vertex[0] + "," + vertex[1] + " " + nextEdge.dx + "," + nextEdge.dy;
                i = nextI;
                processed++;
            }
        }
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

    if (style === "adaptive rounding" && radiusPx > 0) {
        return roundedPath(inset, radiusPx, reach || 0.45);
    }
    return straightPath(inset);
}
