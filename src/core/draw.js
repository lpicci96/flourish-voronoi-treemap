/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

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
    container.appendChild(svg);

    chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    chartGroup.setAttribute("class", "chart-container");
    svg.appendChild(chartGroup);

    facets.appendTo(chartGroup);

    update();
    var resizeTimer;
    var ready = false;
    setTimeout(function() { ready = true; }, 500);
    window.addEventListener("resize", function() {
        if (!ready) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() { update(); }, 150);
    });
}
