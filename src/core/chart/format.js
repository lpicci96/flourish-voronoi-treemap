// Simple seeded PRNG (mulberry32) to keep layout stable across redraws
import * as d3 from "d3";

export function seedrandom(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}


export function getFilterOptions(rows) {
    if (!rows || rows.length === 0) return [];
    if (!rows[0].filter) return [];
    return [...new Set(rows.map(d => d.filter).filter(Boolean))];
}

export function processData(data) {
    const rows = Array.isArray(data) ? data : data.data;
    if (!rows || rows.length === 0) return null;

    const hasTwoLevels = !!rows[0].secondLevel;

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
                children: grouped[key].map(d => ({
                    name: d.secondLevel,
                    value: +d.values || 0,
                    _row: d
                }))
            }))
        };
    } else {
        rootData = {
            name: "root",
            children: rows.map(d => ({
                name: d.firstLevel,
                value: +d.values || 0,
                _row: d
            }))
        };
    }

    return d3.hierarchy(rootData)
        .sum(d => d.value);
}

export function configurePopup(popup, leaves, localization, number_format) {
    const sampleRow = leaves[0] && leaves[0].data._row;
    if (!sampleRow) return;

    const columnNames = {};
    Object.keys(sampleRow).forEach(key => {
        columnNames[key] = key;
    });

    const formatter = number_format(localization.getFormatterFunction());
    const formatters = { values: formatter };

    popup.setColumnNames(columnNames);
    popup.setFormatters(formatters);
}