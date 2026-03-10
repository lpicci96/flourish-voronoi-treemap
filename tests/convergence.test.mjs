import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkConvergence } from "../src/core/chart/convergence.js";

// Helper: create a rectangle polygon with a known area = w * h
// Winding order doesn't matter since checkConvergence uses Math.abs
function rect(w, h) {
    return [[0, 0], [w, 0], [w, h], [0, h]];
}

// Helper: build a mock hierarchy that mimics d3-hierarchy's .each() traversal.
// nodes: array of { name, parent, children, polygon, value }
function mockHierarchy(nodes) {
    return {
        each: function(fn) {
            nodes.forEach(fn);
        }
    };
}

// Helper: capture console.log and console.warn output
function captureConsole() {
    var logs = [];
    var warns = [];
    var origLog = console.log;
    var origWarn = console.warn;
    console.log = function(msg) { logs.push(msg); };
    console.warn = function(msg) { warns.push(msg); };
    return {
        logs: logs,
        warns: warns,
        restore: function() {
            console.log = origLog;
            console.warn = origWarn;
        }
    };
}

describe("checkConvergence — single level", () => {
    it("reports low error when areas match proportions", () => {
        // Parent: area 100 (10x10), two children: values 70 and 30
        // Child areas exactly match: 70 and 30
        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [
                    { data: { name: "A" }, polygon: rect(10, 7), value: 70 },
                    { data: { name: "B" }, polygon: rect(10, 3), value: 30 }
                ]
            },
            { data: { name: "A" }, parent: {}, polygon: rect(10, 7), value: 70, children: null },
            { data: { name: "B" }, parent: {}, polygon: rect(10, 3), value: 30, children: null }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        assert.strictEqual(c.warns.length, 0, "should not warn");
        assert.strictEqual(c.logs.length, 1, "should log once");
        assert.ok(c.logs[0].includes("0.0%"), "area error should be 0%");
    });

    it("detects area error when areas don't match proportions", () => {
        // Parent: area 100, values 70/30 but actual areas 60/40
        // Error = |70-60| + |30-40| = 20, ratio = 20/100 = 20%
        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [
                    { data: { name: "A" }, polygon: rect(10, 6), value: 70 },
                    { data: { name: "B" }, polygon: rect(10, 4), value: 30 }
                ]
            },
            { data: { name: "A" }, parent: {}, polygon: rect(10, 6), value: 70, children: null },
            { data: { name: "B" }, parent: {}, polygon: rect(10, 4), value: 30, children: null }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        assert.strictEqual(c.warns.length, 1, "should warn for >10% error");
        assert.ok(c.warns[0].includes("20.0%"), "area error should be 20%");
    });

    it("shows convergence failure when error exceeds target", () => {
        // Parent: area 100, values 50/50 but actual areas 45/55
        // Error = |50-45| + |50-55| = 10, ratio = 10%
        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [
                    { data: { name: "A" }, polygon: rect(10, 4.5), value: 50 },
                    { data: { name: "B" }, polygon: rect(10, 5.5), value: 50 }
                ]
            },
            { data: { name: "A" }, parent: {}, polygon: rect(10, 4.5), value: 50, children: null },
            { data: { name: "B" }, parent: {}, polygon: rect(10, 5.5), value: 50, children: null }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.005, 0.01);
        c.restore();

        // 10% error but convergence also 10% (no min weight inflation with equal values)
        // Should contain ✗ since 10% > 0.5% target
        var output = (c.logs[0] || "") + (c.warns[0] || "");
        assert.ok(output.includes("✗"), "should show ✗ for unconverged group");
        assert.ok(output.includes("did not converge"), "should show hint");
    });
});

describe("checkConvergence — min weight ratio effect", () => {
    it("convergence error is lower than visual error when min weight inflates small values", () => {
        // Parent: area 100, values: 99 and 1
        // With min_weight_ratio 0.1: minAllowed = 99*0.1 = 9.9, inflated values: 99 and 9.9
        // Inflated proportions: 99/108.9 ≈ 90.9% and 9.9/108.9 ≈ 9.1%
        // Actual areas: 90.9 and 9.1 (matching inflated targets)
        // Visual error: |99%-90.9%| + |1%-9.1%| ≈ 16.2%
        // Convergence error: ~0% (areas match inflated targets)
        var inflatedTotal = 99 + 9.9;
        var area1 = (99 / inflatedTotal) * 100;
        var area2 = (9.9 / inflatedTotal) * 100;

        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [
                    { data: { name: "Big" }, polygon: rect(10, area1 / 10), value: 99 },
                    { data: { name: "Small" }, polygon: rect(10, area2 / 10), value: 1 }
                ]
            },
            { data: { name: "Big" }, parent: {}, polygon: rect(10, area1 / 10), value: 99, children: null },
            { data: { name: "Small" }, parent: {}, polygon: rect(10, area2 / 10), value: 1, children: null }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.1);
        c.restore();

        var output = c.warns[0] || c.logs[0];
        // Convergence should show ✓ (areas match inflated targets)
        assert.ok(output.includes("✓"), "should show ✓ for convergence");
        // Visual error should be high (~16%)
        assert.ok(output.includes("16."), "visual error should be ~16%");
    });
});

describe("checkConvergence — two levels", () => {
    it("reports per-group results for two-level hierarchy", () => {
        // Root → Group A (children a1, a2) and Group B (children b1, b2)
        var childA1 = { data: { name: "a1" }, parent: {}, polygon: rect(5, 6), value: 30, children: null };
        var childA2 = { data: { name: "a2" }, parent: {}, polygon: rect(5, 4), value: 20, children: null };
        var childB1 = { data: { name: "b1" }, parent: {}, polygon: rect(5, 7), value: 35, children: null };
        var childB2 = { data: { name: "b2" }, parent: {}, polygon: rect(5, 3), value: 15, children: null };

        var groupA = {
            data: { name: "Group A" }, parent: {}, polygon: rect(5, 10), value: 50,
            children: [childA1, childA2]
        };
        var groupB = {
            data: { name: "Group B" }, parent: {}, polygon: rect(5, 10), value: 50,
            children: [childB1, childB2]
        };

        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [groupA, groupB]
            },
            groupA, childA1, childA2,
            groupB, childB1, childB2
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        var output = c.logs[0] || c.warns[0];
        assert.ok(output.includes("Top level"), "should show Top level group");
        assert.ok(output.includes("Group A"), "should show Group A");
        assert.ok(output.includes("Group B"), "should show Group B");
    });
});

describe("checkConvergence — edge cases", () => {
    it("handles hierarchy with no children gracefully", () => {
        var hierarchy = mockHierarchy([
            { data: { name: "leaf" }, parent: null, polygon: rect(10, 10), value: 10, children: null }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        assert.strictEqual(c.logs.length, 0, "no output for leaf-only hierarchy");
        assert.strictEqual(c.warns.length, 0, "no warnings for leaf-only hierarchy");
    });

    it("handles children with missing polygons", () => {
        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 100,
                children: [
                    { data: { name: "A" }, polygon: rect(10, 10), value: 80 },
                    { data: { name: "B" }, polygon: null, value: 20 }
                ]
            }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        // Should not throw, should still produce output
        assert.strictEqual(c.logs.length + c.warns.length, 1, "should produce output");
    });

    it("handles zero total value gracefully", () => {
        var hierarchy = mockHierarchy([
            {
                data: { name: "root" },
                parent: null,
                polygon: rect(10, 10),
                value: 0,
                children: [
                    { data: { name: "A" }, polygon: rect(5, 5), value: 0 },
                    { data: { name: "B" }, polygon: rect(5, 5), value: 0 }
                ]
            }
        ]);

        var c = captureConsole();
        checkConvergence(hierarchy, 0.01, 0.01);
        c.restore();

        // Should not throw — visual error is 0 (skipped), convergence still runs
        assert.strictEqual(c.warns.length, 0, "no warnings for zero values");
    });
});
