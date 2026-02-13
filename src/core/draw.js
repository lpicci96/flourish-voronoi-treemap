import data from "./data";
import { layout, colors, legend_container, legend_categorical, popup, localization, number_format } from "../init";
import {drawVoronoi, processData} from "./chart/voronoi";
import state from "./state";

let svg;

export function sizeSvg() {
    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

export function updateLegend(hierarchy) {
    const legendSection = layout.getSection("legend");
    const firstLevelNames = (hierarchy.children || []).map(d => d.data.name);
    colors.updateColorScale(firstLevelNames);
    legend_categorical.data(firstLevelNames, (v) => colors.getColor(v));
    legend_container.update();
    legendSection.style.display = state.legend_categorical.show_legend ? "" : "none";
}

export default function() {
    const container = layout.getSection("primary");
    const legendSection = layout.getSection("legend");

    // Append legend to DOM
    legend_container.appendTo(legendSection).add(legend_categorical);

    const hierarchy = processData(data);
    if (!hierarchy) {
        layout.update();
        return;
    }

    // Update legend before layout so layout allocates space for it
    updateLegend(hierarchy);
    layout.update();

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.border = "1px solid red";
    container.appendChild(svg);
    sizeSvg();

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    drawVoronoi(svg, hierarchy, width, height, state.voronoi_settings, colors, popup, localization, number_format);
}

export { svg };
