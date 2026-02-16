/**
 * Configure a Flourish popup instance with column names and number
 * formatters derived from the current set of leaves.
 * @param {object} popup - Flourish popup instance.
 * @param {Array} leaves - Array of d3-hierarchy leaf nodes.
 * @param {object} localization - Flourish localization instance.
 * @param {Function} number_format - Flourish number_format factory.
 */
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

/**
 * Extract the raw data row from a hierarchy leaf for popup display.
 * @param {object} leaf - d3-hierarchy leaf node.
 * @returns {object} Shallow copy of the leaf's bound data row.
 */
export function getPopupData(leaf) {
    return { ...leaf.data._row };
}
