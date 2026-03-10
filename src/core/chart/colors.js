/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as d3 from "d3";

/**
 * Compute a deterministic 32-bit integer hash from a string.
 * Used to produce stable per-leaf jitter values.
 * @param {string} str - Input string to hash.
 * @returns {number} 32-bit integer hash.
 */
export function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

/**
 * Shift the lightness of a base color by a deterministic amount derived
 * from the leaf name, producing a subtle per-cell color variation.
 * @param {string} baseColor - CSS color string (hex, rgb, etc.).
 * @param {string} leafName - Leaf identifier used to seed the jitter.
 * @param {number} amount - Maximum lightness shift (0–1 range).
 * @returns {string} Hex color string with adjusted lightness.
 */
export function jitterColor(baseColor, leafName, amount) {
    if (!amount || Number(amount) === 0) return baseColor;
    const hsl = d3.hsl(baseColor);
    // Use a deterministic hash to get a value centered between -0.5 and 0.5
    const raw = Math.abs(simpleHash(leafName));
    const hashVal = (raw % 1000) / 1000 - 0.5;
    hsl.l = Math.max(0, Math.min(1, hsl.l + hashVal * amount));
    return hsl.formatHex();
}

/**
 * Resolve the fill color for a single Voronoi cell.
 * Uses `color_category` when present, otherwise falls back to the
 * first-level parent name. Optionally applies lightness jitter to
 * second-level leaves that don't use `color_category`.
 * @param {object} leaf - d3-hierarchy leaf node.
 * @param {object} root - d3-hierarchy root node.
 * @param {object} colors - Flourish color scale instance.
 * @param {object} colorSettings - Color settings (jitter_shade, jitter_amount).
 * @returns {string} Resolved hex color string.
 */
/**
 * Resolve the base (un-jittered) fill color for a Voronoi cell.
 * Uses `color_category` when present, otherwise falls back to the
 * first-level parent name.
 * @param {object} leaf - d3-hierarchy leaf node.
 * @param {object} root - d3-hierarchy root node.
 * @param {object} colors - Flourish color scale instance.
 * @returns {string} Base color string (before jitter).
 */
export function getBaseColor(leaf, root, colors) {
    if (leaf.data._row && leaf.data._row.color_category != null) {
        return colors.getColor(String(leaf.data._row.color_category));
    }
    const firstLevel = leaf.parent === root ? leaf.data.name : leaf.parent.data.name;
    return colors.getColor(firstLevel);
}

export function getCellColor(leaf, root, colors, colorSettings) {
    var baseColor = getBaseColor(leaf, root, colors);

    // Apply jitter to second-level leaves, but not when color_category is used
    const hasColorCategory = leaf.data._row && leaf.data._row.color_category != null;
    if (colorSettings && colorSettings.jitter_shade && leaf.parent !== root && !hasColorCategory) {
        return jitterColor(baseColor, leaf.data.name, colorSettings.jitter_amount != null ? colorSettings.jitter_amount : 0.1);
    }
    return baseColor;
}

/**
 * Determine whether a color is perceptually "pale" (light background).
 * Linearizes sRGB channels and computes WCAG relative luminance.
 * @param {string} hex - CSS color string (hex, rgb, etc.).
 * @returns {boolean} True if the color's relative luminance exceeds 0.179.
 */
export function isPaleColor(hex) {
    const c = d3.rgb(hex);
    // Linearize sRGB channels
    function linearize(v) {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    const L = 0.2126 * linearize(c.r) + 0.7152 * linearize(c.g) + 0.0722 * linearize(c.b);
    return L > 0.179;
}

/**
 * Derive the color domain from a set of hierarchy leaves.
 * When any leaf carries a `color_category` value the domain is the set of
 * unique category strings; otherwise it falls back to the names of the
 * first-level children of the hierarchy.
 * @param {Array} leaves - Array of d3-hierarchy leaf nodes.
 * @param {object} hierarchy - d3-hierarchy root node.
 * @returns {string[]} Ordered array of domain values.
 */
export function getColorDomain(leaves, hierarchy) {
    const hasColorCategory = leaves.some(d => d.data._row && d.data._row.color_category != null);
    return hasColorCategory
        ? [...new Set(leaves.map(d => String(d.data._row.color_category)))]
        : (hierarchy.children || []).map(d => d.data.name);
}
