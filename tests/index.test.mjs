import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { processData, getFilterOptions } from "../src/core/chart/data_formatting.js";

// Helper: build single-level rows
function makeRows(values) {
    return values.map((v, i) => ({ firstLevel: `item${i}`, values: v }));
}

// Helper: build two-level rows
function makeTwoLevelRows(entries) {
    return entries.map(([group, name, v]) => ({
        firstLevel: group,
        secondLevel: name,
        values: v,
    }));
}

// Helper: collect leaf values from hierarchy
function leafValues(hierarchy) {
    return hierarchy.leaves().map(d => d.data.value);
}

describe("processData — value parsing", () => {
    it("parses normal positive numbers", () => {
        const h = processData(makeRows(["10", "20", "30"]));
        assert.deepStrictEqual(leafValues(h), [10, 20, 30]);
    });

    it("preserves zero as a valid value (not treated as missing)", () => {
        const h = processData(makeRows(["0", "5", "0"]));
        assert.deepStrictEqual(leafValues(h), [0, 5, 0]);
    });

    it("treats empty string as 0", () => {
        const h = processData(makeRows(["", "5"]));
        assert.deepStrictEqual(leafValues(h), [0, 5]);
    });

    it("treats undefined/null values as 0", () => {
        const h = processData(makeRows([undefined, null, "7"]));
        assert.deepStrictEqual(leafValues(h), [0, 0, 7]);
    });

    it("treats non-numeric strings as 0", () => {
        const h = processData(makeRows(["abc", "5"]));
        assert.deepStrictEqual(leafValues(h), [0, 5]);
    });

    it("parses float values correctly", () => {
        const h = processData(makeRows(["3.14", "0.5"]));
        assert.deepStrictEqual(leafValues(h), [3.14, 0.5]);
    });
});

describe("processData — negative value handling", () => {
    let warnings;
    let originalWarn;

    beforeEach(() => {
        warnings = [];
        originalWarn = console.warn;
        console.warn = (msg) => warnings.push(msg);
    });

    // Restore console.warn after each test
    // node:test doesn't have afterEach in older versions, so we restore inline
    function restoreWarn() {
        console.warn = originalWarn;
    }

    it("clamps negative values to 0 (single level)", () => {
        const h = processData(makeRows(["-5", "10", "-3"]));
        restoreWarn();
        assert.deepStrictEqual(leafValues(h), [0, 10, 0]);
    });

    it("logs a warning for negative values", () => {
        processData(makeRows(["-5", "10", "-3"]));
        restoreWarn();
        assert.ok(warnings.length > 0, "expected at least one warning");
        assert.ok(
            warnings[0].includes("negative"),
            `expected warning about negatives, got: "${warnings[0]}"`
        );
    });

    it("logs only one warning even with multiple negatives", () => {
        processData(makeRows(["-1", "-2", "-3"]));
        restoreWarn();
        assert.strictEqual(warnings.length, 1);
    });

    it("clamps negative values to 0 (two level)", () => {
        const rows = makeTwoLevelRows([
            ["A", "a1", "-10"],
            ["A", "a2", "5"],
            ["B", "b1", "3"],
        ]);
        const h = processData(rows);
        restoreWarn();
        const values = h.leaves().map(d => d.data.value);
        assert.deepStrictEqual(values, [0, 5, 3]);
    });
});

describe("processData — two level zero handling", () => {
    it("preserves zero in two-level hierarchy", () => {
        const rows = makeTwoLevelRows([
            ["A", "a1", "0"],
            ["A", "a2", "5"],
            ["B", "b1", "10"],
        ]);
        const h = processData(rows);
        const values = h.leaves().map(d => d.data.value);
        assert.deepStrictEqual(values, [0, 5, 10]);
    });
});

describe("processData — edge cases", () => {
    it("returns null for empty input", () => {
        assert.strictEqual(processData([]), null);
    });

    it("returns null for null input", () => {
        assert.strictEqual(processData({ data: null }), null);
    });

    it("preserves _row reference", () => {
        const rows = makeRows(["10"]);
        const h = processData(rows);
        assert.strictEqual(h.leaves()[0].data._row, rows[0]);
    });
});

describe("getFilterOptions", () => {
    it("returns empty array when no filter column", () => {
        const rows = [{ firstLevel: "A", values: "10" }];
        assert.deepStrictEqual(getFilterOptions(rows), []);
    });

    it("returns unique filter values", () => {
        const rows = [
            { firstLevel: "A", values: "10", filter: "x" },
            { firstLevel: "B", values: "20", filter: "y" },
            { firstLevel: "C", values: "30", filter: "x" },
        ];
        assert.deepStrictEqual(getFilterOptions(rows), ["x", "y"]);
    });

    it("returns empty array for empty input", () => {
        assert.deepStrictEqual(getFilterOptions([]), []);
        assert.deepStrictEqual(getFilterOptions(null), []);
    });
});
