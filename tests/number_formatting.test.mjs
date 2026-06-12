import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { format } from "d3-format";
import { createAdaptiveFormatter } from "../src/core/chart/number_formatting.js";

// Minimal mock localization: getFormatterFunction() returns a d3-format
// factory (specifier -> formatter), matching how the real module uses it.
const mockLocalization = {
    getFormatterFunction: () => format
};

// Helper: build a formatter with the given label + number-format settings.
function makeFormatter(labelSettings, numberFormatState) {
    return createAdaptiveFormatter(mockLocalization, labelSettings || {}, numberFormatState || {});
}

describe("createAdaptiveFormatter — threshold selection & suffixes", () => {
    it("selects K for thousands", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(1500), "1.5K");
    });

    it("selects M for millions", () => {
        const f = makeFormatter({ scale_millions: true }, { n_dec: 1 });
        assert.strictEqual(f(2.5e6), "2.5M");
    });

    it("selects B for billions", () => {
        const f = makeFormatter({ scale_billions: true }, { n_dec: 2 });
        assert.strictEqual(f(3e9), "3.00B");
    });

    it("selects T for trillions", () => {
        const f = makeFormatter({ scale_trillions: true }, { n_dec: 0 });
        assert.strictEqual(f(4e12), "4T");
    });

    it("picks the largest applicable scale (largest-first wins)", () => {
        const f = makeFormatter(
            { scale_thousands: true, scale_millions: true, scale_billions: true },
            { n_dec: 1 }
        );
        assert.strictEqual(f(5e6), "5.0M");
        assert.strictEqual(f(5e9), "5.0B");
        assert.strictEqual(f(5e3), "5.0K");
    });
});

describe("createAdaptiveFormatter — #24 sub-threshold decimals regression", () => {
    it("formats a sub-threshold value with the configured n_dec (not raw precision)", () => {
        // 500 is below the thousands threshold => plain format with n_dec=2.
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 2 });
        assert.strictEqual(f(500), "500.00");
    });

    it("respects n_dec=0 for sub-threshold values", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 0 });
        assert.strictEqual(f(500), "500");
    });

    it("defaults to 2 decimals when n_dec is absent", () => {
        const f = makeFormatter({ scale_thousands: true }, {});
        assert.strictEqual(f(500), "500.00");
    });

    it("formats sub-threshold value with no scales enabled", () => {
        const f = makeFormatter({}, { n_dec: 2 });
        assert.strictEqual(f(42), "42.00");
    });
});

describe("createAdaptiveFormatter — negative handling", () => {
    it("uses a leading minus by default", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(-1500), "-1.5K");
    });

    it("uses minus for sub-threshold negatives", () => {
        const f = makeFormatter({}, { n_dec: 2 });
        assert.strictEqual(f(-500), "-500.00");
    });

    it("uses parentheses when negative_sign = parentheses", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1, negative_sign: "parentheses" });
        assert.strictEqual(f(-1500), "(1.5K)");
    });

    it("uses parentheses for sub-threshold negatives", () => {
        const f = makeFormatter({}, { n_dec: 0, negative_sign: "parentheses" });
        assert.strictEqual(f(-42), "(42)");
    });
});

describe("createAdaptiveFormatter — prefix", () => {
    it("prepends prefix to positive values", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1, prefix: "$" });
        assert.strictEqual(f(1500), "$1.5K");
    });

    it("places prefix after the minus sign for negatives", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1, prefix: "$" });
        assert.strictEqual(f(-1500), "-$1.5K");
    });

    it("places prefix inside parentheses for negative parentheses style", () => {
        const f = makeFormatter({}, { n_dec: 0, prefix: "$", negative_sign: "parentheses" });
        assert.strictEqual(f(-42), "($42)");
    });
});

describe("createAdaptiveFormatter — strip_zeros", () => {
    it("strips trailing zeros after the decimal point", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 2, strip_zeros: true });
        assert.strictEqual(f(2000), "2K");
    });

    it("strips trailing zeros but keeps significant decimals", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 2, strip_zeros: true });
        assert.strictEqual(f(2500), "2.5K");
    });

    it("strips trailing zeros on sub-threshold plain numbers", () => {
        const f = makeFormatter({}, { n_dec: 2, strip_zeros: true });
        assert.strictEqual(f(500), "500");
        assert.strictEqual(f(500.5), "500.5");
    });
});

describe("createAdaptiveFormatter — adaptive_space", () => {
    it("inserts a space before the suffix when adaptive_space is set", () => {
        const f = makeFormatter({ scale_thousands: true, adaptive_space: true }, { n_dec: 1 });
        assert.strictEqual(f(1500), "1.5 K");
    });

    it("has no space by default", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(1500), "1.5K");
    });
});

describe("createAdaptiveFormatter — custom suffixes", () => {
    it("uses configured custom suffixes per scale", () => {
        const f = makeFormatter(
            {
                scale_thousands: true, scale_thousands_suffix: "k",
                scale_millions: true, scale_millions_suffix: " mln",
                scale_billions: true, scale_billions_suffix: " bn",
                scale_trillions: true, scale_trillions_suffix: " tn"
            },
            { n_dec: 1 }
        );
        assert.strictEqual(f(1500), "1.5k");
        assert.strictEqual(f(2e6), "2.0 mln");
        assert.strictEqual(f(2e9), "2.0 bn");
        assert.strictEqual(f(2e12), "2.0 tn");
    });
});

describe("createAdaptiveFormatter — null / NaN", () => {
    it("returns empty string for null", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(null), "");
    });

    it("returns empty string for undefined", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(undefined), "");
    });

    it("returns empty string for NaN", () => {
        const f = makeFormatter({ scale_thousands: true }, { n_dec: 1 });
        assert.strictEqual(f(NaN), "");
    });
});
