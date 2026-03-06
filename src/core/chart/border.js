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

// ── Per-cell path generator ─────────────────────────────────────────────

/**
 * Straight polygon path: M...L...L...Z
 */
function straightPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Return an SVG path `d` string for a single polygon.
 * @param {Array<number[]>} polygon - Array of coordinate pairs.
 * @param {number} [gap=0] - Resolved gap size in pixels (polygon is inset by gap/2).
 * @returns {string} SVG path data string.
 */
export function borderPath(polygon, gap) {
    const inset = gap ? insetPolygon(polygon, gap) : polygon;
    return straightPath(inset);
}
