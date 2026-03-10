import * as d3 from "d3";

/**
 * Post-hoc convergence check that mirrors how d3-voronoi-treemap works
 * internally: each internal node's children are laid out independently
 * within the parent's polygon, so convergence is checked per group.
 * Reports two metrics per group:
 *   - Convergence: error against min-weight-inflated targets (did the algorithm converge?)
 *   - Visual accuracy: error against original data values (does the visual match the data?)
 * Uses d3.polygonArea — the same shoelace function the library uses.
 * @param {object} hierarchy - d3-hierarchy root node after layout.
 * @param {number} targetRatio - Maximum acceptable error ratio (e.g. 0.01).
 * @param {number} minWeightRatio - Min weight ratio used by the algorithm.
 */
export function checkConvergence(hierarchy, targetRatio, minWeightRatio) {
    var groups = [];

    hierarchy.each(function(node) {
        if (!node.children || node.children.length === 0) return;
        if (!node.polygon) return;

        var parentArea = Math.abs(d3.polygonArea(node.polygon));
        if (parentArea === 0) return;

        var children = node.children.filter(function(c) { return c.polygon && c.polygon.length > 0; });
        if (children.length === 0) return;

        // Visual accuracy: error against original values
        var totalValue = children.reduce(function(s, c) { return s + c.value; }, 0);
        var visualError = 0;
        if (totalValue > 0) {
            visualError = children.reduce(function(s, c) {
                var expectedArea = (c.value / totalValue) * parentArea;
                var actualArea = Math.abs(d3.polygonArea(c.polygon));
                return s + Math.abs(actualArea - expectedArea);
            }, 0) / parentArea;
        }

        // Convergence: error against min-weight-inflated targets (matching library logic)
        var maxValue = children.reduce(function(m, c) { return Math.max(m, c.value); }, -Infinity);
        var minAllowedWeight = maxValue * minWeightRatio;
        var totalInflated = children.reduce(function(s, c) { return s + Math.max(c.value, minAllowedWeight); }, 0);
        var convergenceError = 0;
        if (totalInflated > 0) {
            convergenceError = children.reduce(function(s, c) {
                var inflatedWeight = Math.max(c.value, minAllowedWeight);
                var expectedArea = (inflatedWeight / totalInflated) * parentArea;
                var actualArea = Math.abs(d3.polygonArea(c.polygon));
                return s + Math.abs(actualArea - expectedArea);
            }, 0) / parentArea;
        }

        groups.push({
            name: node.parent ? node.data.name : "Top level",
            convergenceError: convergenceError,
            visualError: visualError
        });
    });

    if (groups.length === 0) return;

    var avgConvergence = groups.reduce(function(s, g) { return s + g.convergenceError; }, 0) / groups.length;
    var avgVisual = groups.reduce(function(s, g) { return s + g.visualError; }, 0) / groups.length;

    // Find longest group name for alignment
    var maxNameLen = groups.reduce(function(m, g) { return Math.max(m, g.name.length); }, 0);
    maxNameLen = Math.max(maxNameLen, "Overall".length);

    function pad(str, len) { while (str.length < len) str += " "; return str; }

    var lines = [
        "Voronoi layout (convergence target: " + (targetRatio * 100).toFixed(1) + "%, min weight ratio: " + minWeightRatio + ")",
        "  " + pad("Group", maxNameLen) + "   Area error   Converged"
    ];
    groups.forEach(function(g) {
        var convStatus = g.convergenceError <= targetRatio ? "✓" : "✗";
        lines.push(
            "  " + pad(g.name, maxNameLen) +
            "   " + pad((g.visualError * 100).toFixed(1) + "%", 10) +
            "   " + (g.convergenceError * 100).toFixed(1) + "% " + convStatus
        );
    });
    lines.push(
        "  " + pad("Overall", maxNameLen) +
        "   " + pad((avgVisual * 100).toFixed(1) + "%", 10) +
        "   " + (avgConvergence * 100).toFixed(1) + "%"
    );

    var hasNotConverged = groups.some(function(g) { return g.convergenceError > targetRatio; });
    if (hasNotConverged) {
        lines.push("  ✗ = did not converge, try increasing max iterations");
    }

    var hasHighVisualError = groups.some(function(g) { return g.visualError > 0.1; });
    if (hasHighVisualError) {
        console.warn(lines.join("\n"));
    } else {
        console.log(lines.join("\n"));
    }
}
