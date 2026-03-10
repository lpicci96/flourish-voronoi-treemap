import * as d3 from "d3";

/**
 * Create a seeded pseudo-random number generator (mulberry32).
 * Keeps the Voronoi layout stable across redraws for a given seed.
 * @param {number} seed - Integer seed value.
 * @returns {Function} PRNG function returning values in [0, 1).
 */
export function seedrandom(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Extract unique filter option values from data rows.
 * Returns an empty array when no `filter` column is present.
 * @param {Array<object>} rows - Raw data rows.
 * @returns {string[]} Unique, non-empty filter values.
 */
export function getFilterOptions(rows) {
    if (!rows || rows.length === 0) return [];
    if (!rows[0].filter) return [];
    return [...new Set(rows.map(d => d.filter).filter(Boolean))];
}

/**
 * Convert flat data rows into a d3-hierarchy with summed values.
 * Supports single-level (`firstLevel`) and two-level (`firstLevel` +
 * `secondLevel`) hierarchies.
 * @param {Array<object>|{data: Array<object>}} data - Input data (array or object with `.data`).
 * @returns {object|null} d3-hierarchy root node, or null if input is empty.
 */
export function processData(data) {
    const rows = Array.isArray(data) ? data : data.data;
    if (!rows || rows.length === 0) return null;

    const hasTwoLevels = !!rows[0].secondLevel;

    let negativeWarned = false;
    let rootData;
    if (hasTwoLevels) {
        const grouped = {};
        rows.forEach(d => {
            if (!grouped[d.firstLevel]) grouped[d.firstLevel] = [];
            grouped[d.firstLevel].push(d);
        });

        rootData = {
            name: "root",
            children: Object.keys(grouped).map(key => ({
                name: key,
                children: grouped[key].map(d => {
                    const v = parseFloat(d.values);
                    const value = isNaN(v) ? 0 : v;
                    if (value < 0) {
                        if (!negativeWarned) {
                            console.warn("Voronoi: negative value(s) found in data — treating as 0");
                            negativeWarned = true;
                        }
                        return { name: d.secondLevel, value: 0, _row: d };
                    }
                    return { name: d.secondLevel, value: value, _row: d };
                })
            }))
        };
    } else {
        rootData = {
            name: "root",
            children: rows.map(d => {
                const v = parseFloat(d.values);
                const value = isNaN(v) ? 0 : v;
                if (value < 0) {
                    if (!negativeWarned) {
                        console.warn("Voronoi: negative value(s) found in data — treating as 0");
                        negativeWarned = true;
                    }
                    return { name: d.firstLevel, value: 0, _row: d };
                }
                return { name: d.firstLevel, value: value, _row: d };
            })
        };
    }

    return d3.hierarchy(rootData)
        .sum(d => d.value);
}
