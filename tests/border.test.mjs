import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { insetPolygon, borderPath } from "../src/core/chart/border.js";

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
