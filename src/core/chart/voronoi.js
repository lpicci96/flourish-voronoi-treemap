// TODO: Additional advanced settings - handling small values
// TODO: Aggregation of values
// TODO: Align chart left, center or right within section



import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";
import {clipVoronoi} from "./clip";
import {configurePopup, seedrandom} from "./format";

const _voronoiTreemap = voronoiTreemap();

function computeLayout(hierarchy, voronoi_settings, height, width) {
    const clip = clipVoronoi(voronoi_settings.clip_type, height, width);

    _voronoiTreemap
        .clip(clip)
        .convergenceRatio(voronoi_settings.convergence_ratio)
        .maxIterationCount(voronoi_settings.max_iterations)
        .prng(seedrandom(voronoi_settings.seed));

    _voronoiTreemap(hierarchy);
}

function polygonPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

function getCellColor(leaf, root, colors) {
    const firstLevel = leaf.parent === root ? leaf.data.name : leaf.parent.data.name;
    return colors.getColor(firstLevel);
}

function getPopupData(leaf) {
    return { ...leaf.data._row };
}

function renderCells(svg, leaves, root, voronoi_settings, colors, popup) {
    const svgSel = d3.select(svg);

    let g = svgSel.selectAll("g.cells").data([null]);
    g = g.enter().append("g").attr("class", "cells").merge(g);

    popup.clickout();

    g.selectAll("path")
        .data(leaves, d => d.data.name)
        .join("path")
        .attr("d", d => polygonPath(d.polygon))
        .attr("fill", d => getCellColor(d, root, colors))
        .attr("stroke", voronoi_settings.border_color)
        .attr("stroke-width", voronoi_settings.border_size)
        .on("mouseover", function(event, d) {
            const popupData = getPopupData(d);
            popup.mouseover(this, popupData);
        })
        .on("mouseout", function() {
            popup.mouseout();
        })
        .on("click", function(event, d) {
            event.stopPropagation();
            popup.click(this, getPopupData(d), d.data.name);
        });

    svgSel.on("click", function() {
        popup.clickout();
    });
}

export function drawVoronoi(svg, hierarchy, width, height, voronoi_settings, colors, popup, localization, number_format) {
    if (!hierarchy) return;

    computeLayout(hierarchy, voronoi_settings, height, width);

    const firstLevelNames = (hierarchy.children || []).map(d => d.data.name);
    colors.updateColorScale(firstLevelNames);

    const leaves = hierarchy.leaves().filter(d => d.polygon && d.polygon.length > 0);
    configurePopup(popup, leaves, localization, number_format);
    renderCells(svg, leaves, hierarchy, voronoi_settings, colors, popup);
}