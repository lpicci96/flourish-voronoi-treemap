export function createValueFormatter(localization, number_format) {
    return number_format(localization.getFormatterFunction());
}

export function configurePopup(popup, leaves, localization, number_format) {
    const sampleRow = leaves[0] && leaves[0].data._row;
    if (!sampleRow) return;

    const columnNames = {};
    Object.keys(sampleRow).forEach(key => {
        columnNames[key] = key;
    });

    const formatter = createValueFormatter(localization, number_format);
    const formatters = { values: formatter };

    popup.setColumnNames(columnNames);
    popup.setFormatters(formatters);
}