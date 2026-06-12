import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { insetPolygon, borderPath, clipConvex } from "../src/core/chart/border.js";

// A 100x100 axis-aligned square. CCW (in screen y-down coords) and CW variants.
const squareCCW = [[0, 0], [0, 100], [100, 100], [100, 0]];
const squareCW = [[0, 0], [100, 0], [100, 100], [0, 100]];

function bbox(poly) {
    const xs = poly.map(p => p[0]);
    const ys = poly.map(p => p[1]);
    return {
        xMin: Math.min(...xs), xMax: Math.max(...xs),
        yMin: Math.min(...ys), yMax: Math.max(...ys)
    };
}

describe("insetPolygon — shrinks inward by amount/2 per side", () => {
    function assertInsetByHalf(poly) {
        const amount = 10; // each side moves inward by amount/2 = 5
        const inset = insetPolygon(poly, amount);
        const b = bbox(inset);
        assert.ok(Math.abs(b.xMin - 5) < 1e-6, `xMin ${b.xMin}`);
        assert.ok(Math.abs(b.xMax - 95) < 1e-6, `xMax ${b.xMax}`);
        assert.ok(Math.abs(b.yMin - 5) < 1e-6, `yMin ${b.yMin}`);
        assert.ok(Math.abs(b.yMax - 95) < 1e-6, `yMax ${b.yMax}`);
    }

    it("works for CCW winding", () => {
        assertInsetByHalf(squareCCW);
    });

    it("works for CW winding", () => {
        assertInsetByHalf(squareCW);
    });
});

describe("insetPolygon — passthrough cases", () => {
    it("returns the original polygon for fewer than 3 points", () => {
        const two = [[0, 0], [10, 10]];
        assert.strictEqual(insetPolygon(two, 10), two);
    });

    it("returns the original polygon for amount 0", () => {
        assert.strictEqual(insetPolygon(squareCCW, 0), squareCCW);
    });

    it("returns the original polygon for falsy amount", () => {
        assert.strictEqual(insetPolygon(squareCCW, undefined), squareCCW);
    });
});

describe("borderPath — straight style", () => {
    it("produces an M...L...Z path", () => {
        const d = borderPath(squareCCW, "straight");
        assert.ok(d.startsWith("M"), "starts with M");
        assert.ok(d.endsWith("Z"), "ends with Z");
        assert.ok(d.includes("L"), "contains line commands");
    });

    it("defaults to straight when style is omitted", () => {
        const d = borderPath(squareCCW);
        assert.ok(d.startsWith("M") && d.endsWith("Z") && d.includes("L"));
    });
});

describe("borderPath — adaptive rounding", () => {
    it("produces curve commands (Q or C) with radiusPx > 0", () => {
        const d = borderPath(squareCCW, "adaptive rounding", 0, 10);
        assert.ok(d.startsWith("M"), "starts with M");
        assert.ok(d.endsWith("Z"), "ends with Z");
        assert.ok(/[QC]/.test(d), "contains a Q or C curve command");
    });

    it("falls back to straight when radiusPx is 0", () => {
        const d = borderPath(squareCCW, "adaptive rounding", 0, 0);
        assert.ok(!/[QC]/.test(d), "no curve commands when radius is 0");
        assert.ok(d.includes("L"));
    });
});

// Extract all numeric coordinates from an SVG path `d` string as [x, y] pairs.
function pathCoords(d) {
    const nums = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
        pts.push([nums[i], nums[i + 1]]);
    }
    return pts;
}

describe("clipConvex — clips a convex subject to a convex clip", () => {
    // 10x10 square at origin, both windings to confirm winding-independence.
    const subjectCCW = [[0, 0], [0, 10], [10, 10], [10, 0]];
    const subjectCW = [[0, 0], [10, 0], [10, 10], [0, 10]];
    // Centered 6x6 window: x,y in [2, 8].
    const window6 = [[2, 2], [8, 2], [8, 8], [2, 8]];

    function assertBboxIs6(poly) {
        const b = bbox(poly);
        assert.ok(Math.abs(b.xMin - 2) < 1e-6, `xMin ${b.xMin}`);
        assert.ok(Math.abs(b.xMax - 8) < 1e-6, `xMax ${b.xMax}`);
        assert.ok(Math.abs(b.yMin - 2) < 1e-6, `yMin ${b.yMin}`);
        assert.ok(Math.abs(b.yMax - 8) < 1e-6, `yMax ${b.yMax}`);
    }

    it("yields the 6x6 region when clipping a 10x10 by a centered 6x6 (CCW subject)", () => {
        assertBboxIs6(clipConvex(subjectCCW, window6));
    });

    it("yields the 6x6 region regardless of subject winding (CW subject)", () => {
        assertBboxIs6(clipConvex(subjectCW, window6));
    });

    it("yields the 6x6 region regardless of clip winding (CW clip)", () => {
        const window6CW = [[2, 2], [2, 8], [8, 8], [8, 2]];
        assertBboxIs6(clipConvex(subjectCCW, window6CW));
    });

    it("returns approximately the original when the clip fully contains the subject", () => {
        const big = [[-5, -5], [15, -5], [15, 15], [-5, 15]];
        const out = clipConvex(subjectCCW, big);
        const b = bbox(out);
        assert.ok(Math.abs(b.xMin - 0) < 1e-6 && Math.abs(b.xMax - 10) < 1e-6, "x preserved");
        assert.ok(Math.abs(b.yMin - 0) < 1e-6 && Math.abs(b.yMax - 10) < 1e-6, "y preserved");
    });

    it("returns the original subject (fallback) when clip does not overlap", () => {
        const far = [[100, 100], [110, 100], [110, 110], [100, 110]];
        assert.strictEqual(clipConvex(subjectCCW, far), subjectCCW);
    });

    it("returns the subject when clip polygon is degenerate (< 3 pts)", () => {
        assert.strictEqual(clipConvex(subjectCCW, [[0, 0], [1, 1]]), subjectCCW);
    });
});

describe("borderPath — with clipPolygon", () => {
    // 100x100 square clipped to a centered 40x40 window: x,y in [30, 70].
    const window40 = [[30, 30], [70, 30], [70, 70], [30, 70]];

    it("bounds the resulting path within the clip bbox", () => {
        const d = borderPath(squareCCW, "straight", 0, 0, 0.45, window40);
        const coords = pathCoords(d);
        assert.ok(coords.length >= 3, "has vertices");
        for (const [x, y] of coords) {
            assert.ok(x >= 30 - 1e-6 && x <= 70 + 1e-6, `x ${x} within clip`);
            assert.ok(y >= 30 - 1e-6 && y <= 70 + 1e-6, `y ${y} within clip`);
        }
    });

    it("composes with gap inset (still within clip bbox)", () => {
        const d = borderPath(squareCCW, "straight", 10, 0, 0.45, window40);
        const coords = pathCoords(d);
        for (const [x, y] of coords) {
            assert.ok(x >= 30 - 1e-6 && x <= 70 + 1e-6, `x ${x} within clip`);
            assert.ok(y >= 30 - 1e-6 && y <= 70 + 1e-6, `y ${y} within clip`);
        }
    });

    it("is byte-identical to no-clip behavior when clipPolygon is omitted", () => {
        const withUndef = borderPath(squareCCW, "straight", 10, 0, 0.45);
        const legacy = borderPath(squareCCW, "straight", 10, 0, 0.45);
        assert.strictEqual(withUndef, legacy);
        // And passing an explicit undefined clip equals omitting it.
        const explicitUndef = borderPath(squareCCW, "straight", 10, 0, 0.45, undefined);
        assert.strictEqual(explicitUndef, legacy);
    });
});
