import { layout, colors, legend_container, legend_categorical, controls_container, filter_control, facets, controlsStyle, buttonStyle, dropdownStyle, sliderStyle } from "../init";
import state from "./state";
import update from "./update";

export let svg;
export let chartGroup;

export function sizeSvg() {
    const width = layout.getPrimaryWidth();
    const computedHeight = facets.height();
    const height = computedHeight || layout.getPrimaryHeight();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

export function updateLegend(colorDomain) {
    const legendSection = layout.getSection("legend");
    colors.updateColorScale(colorDomain);
    legend_categorical.data(colorDomain, (v) => colors.getColor(v));
    legend_container.update();
    legendSection.style.display = state.legend_categorical.show_legend ? "" : "none";
}

export function updateControlStyles() {
    controlsStyle.update();
    buttonStyle.update();
    dropdownStyle.update();
    sliderStyle.update();
}

export default function() {
    const container = layout.getSection("primary");
    const legendSection = layout.getSection("legend");
    const controlsSection = layout.getSection("controls");

    // Append legend to DOM
    legend_container.appendTo(legendSection).add(legend_categorical);

    // Append controls to DOM
    controls_container
        .appendTo(controlsSection)
        .add(filter_control);

    filter_control.on("change", function() { update(); });

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.style.outline = "2px solid red"; // Debugging outline to visualize SVG boundaries
    // svg.style.display = "block";
    container.appendChild(svg);
    // container.style.outline = "2px solid green"; // Debugging outline to visualize container boundaries

    chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    chartGroup.setAttribute("class", "chart-container");
    svg.appendChild(chartGroup);

    facets.appendTo(chartGroup);

    update();
    window.onresize = function () { update(); };
}
