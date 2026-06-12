import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as d3 from "d3";
import {
    simpleHash,
    jitterColor,
    isPaleColor,
    getColorDomain
} from "../src/core/chart/colors.js";

// Helper: build a plain-object leaf stub. The functions read d.data._row and
// d.data.name, so we only populate those.
function leafStub(name, colorCategory) {
    const data = { name };
    data._row = colorCategory != null ? { color_category: colorCategory } : {};
    return { data };
}

// Helper: build a hierarchy stub with first-level children (reads children[].data.name).
function hierarchyStub(childNames) {
    return { children: childNames.map(n => ({ data: { name: n } })) };
}

describe("simpleHash / jitterColor — determinism", () => {
    it("simpleHash is stable across calls for the same input", () => {
        assert.strictEqual(simpleHash("leaf-a"), simpleHash("leaf-a"));
        assert.strictEqual(simpleHash("Some Long Name 123"), simpleHash("Some Long Name 123"));
    });

    it("jitterColor returns identical output for the same (base, name, amount)", () => {
        const a = jitterColor("#3366cc", "leaf-x", 0.2);
        const b = jitterColor("#3366cc", "leaf-x", 0.2);
        assert.strictEqual(a, b);
    });

    it("jitterColor produces a range of outputs across many leaf names", () => {
        // Different names hash to different lightness shifts, so a sizeable
        // sample should yield more than one distinct color.
        const seen = new Set();
        for (let i = 0; i < 50; i++) {
            seen.add(jitterColor("#3366cc", "leaf-" + i, 0.3));
        }
        assert.ok(seen.size > 1, "expected multiple distinct jittered colors");
    });
});

describe("jitterColor — zero / falsy amount", () => {
    it("returns the base color unchanged for amount 0", () => {
        assert.strictEqual(jitterColor("#3366cc", "leaf-x", 0), "#3366cc");
    });

    it("returns the base color unchanged for falsy amount (undefined)", () => {
        assert.strictEqual(jitterColor("#3366cc", "leaf-x", undefined), "#3366cc");
    });
});

describe("jitterColor — #29 safe band regression", () => {
    // Lightness must stay within [0.15, 0.85] even for extreme base colors.
    const SAFE_MIN = 0.15;
    const SAFE_MAX = 0.85;
    // The clamp is applied in HSL space, but jitterColor returns a hex string;
    // re-parsing the rounded hex back to HSL can drift by up to ~1 byte (~1/255).
    const TOL = 1 / 255 + 1e-6;

    function assertSafeBand(baseColor) {
        for (let i = 0; i < 500; i++) {
            const name = "leaf-" + i + "-" + (i * 31 + 7);
            const out = jitterColor(baseColor, name, 0.9);
            const l = d3.hsl(out).l;
            assert.ok(
                l >= SAFE_MIN - TOL && l <= SAFE_MAX + TOL,
                `lightness ${l} out of safe band for base ${baseColor}, name ${name}`
            );
        }
    }

    it("keeps lightness in band for a near-black base", () => {
        assertSafeBand("#050505");
    });

    it("keeps lightness in band for a near-white base", () => {
        assertSafeBand("#fafafa");
    });
});

describe("isPaleColor", () => {
    it("treats white as pale", () => {
        assert.strictEqual(isPaleColor("#ffffff"), true);
    });

    it("treats black as not pale", () => {
        assert.strictEqual(isPaleColor("#000000"), false);
    });

    it("classifies around the ~0.179 luminance boundary", () => {
        // A light grey is above the boundary (pale); a darker grey is below.
        assert.strictEqual(isPaleColor("#bbbbbb"), true);
        assert.strictEqual(isPaleColor("#666666"), false);
    });
});

describe("getColorDomain", () => {
    it("returns unique color categories when leaves carry color_category", () => {
        const leaves = [
            leafStub("a", "Europe"),
            leafStub("b", "Asia"),
            leafStub("c", "Europe"),
            leafStub("d", "Africa")
        ];
        const hierarchy = hierarchyStub(["g1", "g2"]);
        assert.deepStrictEqual(getColorDomain(leaves, hierarchy), ["Europe", "Asia", "Africa"]);
    });

    it("falls back to first-level child names when no color_category present", () => {
        const leaves = [leafStub("a"), leafStub("b"), leafStub("c")];
        const hierarchy = hierarchyStub(["Group A", "Group B", "Group C"]);
        assert.deepStrictEqual(getColorDomain(leaves, hierarchy), ["Group A", "Group B", "Group C"]);
    });

    it("returns empty array when no categories and hierarchy has no children", () => {
        const leaves = [leafStub("a")];
        assert.deepStrictEqual(getColorDomain(leaves, {}), []);
    });
});
