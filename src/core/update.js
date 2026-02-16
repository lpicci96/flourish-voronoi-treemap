import data from "./data";
import state from "./state";
import { layout, colors, legend_container, legend_categorical, popup, localization, number_format, controls_container, filter_control } from "../init";
import { sizeSvg, svg, updateLegend, updateControlStyles } from "./draw";
import { drawVoronoi } from "./chart/voronoi";
import { processData, getFilterOptions } from "./chart/format"

export default function() {
    const rows = Array.isArray(data) ? data : data.data;

    // Update filter control with unique values from the filter column
    const filterOptions = getFilterOptions(rows);
    const hasFilter = filterOptions.length > 0;

    if (hasFilter) {
        filter_control.options(filterOptions);
    }

    // Update control styles before container update
    updateControlStyles();
    controls_container.update();

    // Get the currently selected filter value
    const selectedFilter = hasFilter ? filter_control.value() : null;

    // Filter the data based on the selected value
    const filteredRows = hasFilter && selectedFilter
        ? rows.filter(d => d.filter === selectedFilter)
        : rows;

    const hierarchy = processData({ data: filteredRows });
    if (!hierarchy) {
        layout.update();
        sizeSvg();
        return;
    }

    // Update legend before layout so layout allocates space for it
    updateLegend(hierarchy);
    layout.update();
    sizeSvg();

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    drawVoronoi(svg, hierarchy, width, height, state.voronoi_settings, colors, popup, localization, number_format);
    popup.update();
}
