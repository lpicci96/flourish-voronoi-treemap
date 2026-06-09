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
 */
export function configurePopup(popup, leaves, localization, number_format, labelSettings, numberFormatState, dataColumnNames) {
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
