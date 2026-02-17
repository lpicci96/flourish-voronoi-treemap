import data from "./data";
import state from "./state";
import { layout, colors, legend_container, legend_categorical, popup, localization, number_format, controls_container, filter_control, facets } from "../init";
import { sizeSvg, svg, updateLegend, updateControlStyles } from "./draw";
import { drawVoronoi } from "./chart/voronoi";
import { processData, getFilterOptions } from "./chart/data_formatting"

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

    // Group data by facet value
    const facetValues = [...new Set(filteredRows.map(d => d.facet))];
    const hasFacets = facetValues.length > 0 && !(facetValues.length === 1 && (facetValues[0] == null || facetValues[0] === ""));
    const facetKeys = hasFacets ? facetValues.filter(v => v != null && v !== "") : [""];

    const groupedByFacet = new Map();
    for (const key of facetKeys) {
        groupedByFacet.set(key, []);
    }
    for (const row of filteredRows) {
        const key = hasFacets ? (row.facet || "") : "";
        if (groupedByFacet.has(key)) {
            groupedByFacet.get(key).push(row);
        }
    }

    // Process each facet group into a hierarchy
    const facetHierarchies = new Map();
    for (const [key, groupRows] of groupedByFacet) {
        if (groupRows.length === 0) continue;
        const hierarchy = processData({ data: groupRows });
        if (hierarchy) facetHierarchies.set(key, hierarchy);
    }

    if (facetHierarchies.size === 0) {
        layout.update();
        sizeSvg();
        return;
    }

    // Compute global color domain across all facets
    const allLeaves = [];
    const allHierarchies = [...facetHierarchies.values()];
    for (const h of allHierarchies) {
        allLeaves.push(...h.leaves());
    }
    // Check if any leaf uses color_category
    const hasColorCategory = allLeaves.some(d => d.data._row && d.data._row.color_category != null);
    let globalColorDomain;
    if (hasColorCategory) {
        globalColorDomain = [...new Set(allLeaves.map(d => String(d.data._row.color_category)))];
    } else {
        // Collect first-level children names from all hierarchies
        const names = new Set();
        for (const h of allHierarchies) {
            (h.children || []).forEach(d => names.add(d.data.name));
        }
        globalColorDomain = [...names];
    }

    // Update legend with global domain before layout so layout allocates space for it
    updateLegend(globalColorDomain);
    layout.update();

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();

    // Build facet data array
    const facetData = [...facetHierarchies.keys()].map(key => ({
        name: key,
        hierarchy: facetHierarchies.get(key)
    }));

    // Drive the facets grid
    facets
        .data(facetData, d => d.name)
        .width(width)
        .height(height)
        .hideTitle("")
        .update(function(facet) {
            const item = facet.data;
            if (!item || !item.hierarchy) return;
            drawVoronoi(facet.node, item.hierarchy, facet.width, facet.height, state.voronoi_settings, colors, popup, localization, number_format, state.colors);
        });

    sizeSvg();
    popup.update();
}
