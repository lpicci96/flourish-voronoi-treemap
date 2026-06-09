/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { createAdaptiveFormatter } from "./number_formatting";

/**
 * Configure a Flourish popup instance with column names and number
 * formatters derived from the current set of leaves.
 * @param {object} popup - Flourish popup instance.
 * @param {Array} leaves - Array of d3-hierarchy leaf nodes.
 * @param {object} localization - Flourish localization instance.
 * @param {Function} number_format - Flourish number_format factory.
 * @param {object} labelSettings - The state.labels settings object.
 * @param {object} numberFormatState - The raw state.number_format object.
 * @param {object} dataColumnNames - Flourish SDK column_names mapping (binding key → actual CSV header).
 * @param {object} dataMetadata - Flourish SDK metadata mapping (binding key → per-column metadata, e.g. output_format_id).
 */
export function configurePopup(popup, leaves, localization, number_format, labelSettings, numberFormatState, dataColumnNames, dataMetadata) {
    const sampleRow = leaves[0] && leaves[0].data._row;
    if (!sampleRow) return;

    const fallbackNames = {
        firstLevel: "First level",
        secondLevel: "Second level",
        values: "Values",
        filter: "Filter",
        color_category: "Color category",
    };

    const columnNames = {};
    Object.keys(sampleRow).forEach(key => {
        columnNames[key] = (dataColumnNames && dataColumnNames[key]) || fallbackNames[key] || key;
    });

    var formatter;
    if (labelSettings && labelSettings.adaptive_format) {
        formatter = createAdaptiveFormatter(localization, labelSettings, numberFormatState);
    } else {
        formatter = number_format(localization.getFormatterFunction());
    }
    const formatters = { values: formatter };

    // Build a parallel formatters array for the multi-column `info` binding.
    // Each element uses the column's output_format_id metadata when available
    // (info-popup resolves it via getFormatter), otherwise a string passthrough.
    const infoHeaders = dataColumnNames && dataColumnNames.info;
    if (Array.isArray(infoHeaders) && infoHeaders.length) {
        const infoMeta = dataMetadata && Array.isArray(dataMetadata.info) ? dataMetadata.info : [];
        formatters.info = infoHeaders.map(function(_, i) {
            return (infoMeta[i] && infoMeta[i].output_format_id)
                ? infoMeta[i]                                  // {output_format_id} — info-popup resolves it
                : function(v) { return v == null ? "" : String(v); };  // string / passthrough
        });
    }

    popup.setColumnNames(columnNames);
    popup.setFormatters(formatters);
}

/**
 * Extract the raw data row from a hierarchy leaf for popup display.
 * @param {object} leaf - d3-hierarchy leaf node.
 * @returns {object} Shallow copy of the leaf's bound data row.
 */
export function getPopupData(leaf) {
    return { ...leaf.data._row };
}
