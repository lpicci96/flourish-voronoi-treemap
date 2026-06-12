import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { clipVoronoi } from "../src/core/chart/clip.js";

// Helpers to read polygon extents.
function xExtent(poly) {
    const xs = poly.map(p => p[0]);
    return [Math.min(...xs), Math.max(...xs)];
}
function yExtent(poly) {
    const ys = poly.map(p => p[1]);
    return [Math.min(...ys), Math.max(...ys)];
}

describe("clipVoronoi — vertex counts per shape", () => {
    const cases = [
        ["square", 4],
        ["rectangle", 4],
        ["triangle", 3],
        ["rhombus", 4],
        ["pentagon", 5],
        ["hexagon", 6],
        ["circle", 64]
    ];
    for (const [shape, count] of cases) {
        it(`${shape} has ${count} vertices`, () => {
            assert.strictEqual(clipVoronoi(shape, 400, 600).length, count);
        });
    }
});

describe("clipVoronoi — rectangle & square geometry", () => {
    it("rectangle spans the full area [0,0]..[width,height]", () => {
        const poly = clipVoronoi("rectangle", 400, 600);
        assert.deepStrictEqual(xExtent(poly), [0, 600]);
        assert.deepStrictEqual(yExtent(poly), [0, 400]);
    });

    it("square uses the shorter side and is centered", () => {
        const height = 400, width = 600;
        const poly = clipVoronoi("square", height, width);
        const side = Math.min(height, width); // 400
        const [xMin, xMax] = xExtent(poly);
        const [yMin, yMax] = yExtent(poly);
        assert.strictEqual(xMax - xMin, side);
        assert.strictEqual(yMax - yMin, side);
        // Centered: offsets equal on each side.
        assert.strictEqual(xMin, (width - side) / 2);
        assert.strictEqual(yMin, (height - side) / 2);
    });
});

describe("clipVoronoi — horizontal centering", () => {
    const shapes = ["triangle", "pentagon", "hexagon", "rhombus", "circle", "square"];
    for (const shape of shapes) {
        it(`${shape} is horizontally centered within width`, () => {
            const width = 800, height = 300;
            const poly = clipVoronoi(shape, height, width);
            const [xMin, xMax] = xExtent(poly);
            const center = (xMin + xMax) / 2;
            assert.ok(Math.abs(center - width / 2) < 1e-6, `center ${center} != ${width / 2}`);
        });
    }
});

describe("clipVoronoi — unknown shape", () => {
    it("throws for an unrecognised shape", () => {
        assert.throws(() => clipVoronoi("octagon", 400, 600), /Unknown clip shape/);
    });
});
