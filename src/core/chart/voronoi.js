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

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function jitterColor(baseColor, leafName, amount) {
    if (!amount || Number(amount) === 0) return baseColor;
    const hsl = d3.hsl(baseColor);
    // Use a deterministic hash to get a value centered between -0.5 and 0.5
    const raw = Math.abs(simpleHash(leafName));
    const hashVal = (raw % 1000) / 1000 - 0.5;
    hsl.l = Math.max(0, Math.min(1, hsl.l + hashVal * amount));
    return hsl.formatHex();
}

function getCellColor(leaf, root, colors, colorSettings) {
    let baseColor;
    if (leaf.data._row && leaf.data._row.color_category != null) {
        baseColor = colors.getColor(String(leaf.data._row.color_category));
    } else {
        const firstLevel = leaf.parent === root ? leaf.data.name : leaf.parent.data.name;
        baseColor = colors.getColor(firstLevel);
    }

    // Apply jitter to second-level leaves, but not when color_category is used
    const hasColorCategory = leaf.data._row && leaf.data._row.color_category != null;
    if (colorSettings && colorSettings.jitter_shade && leaf.parent !== root && !hasColorCategory) {
        return jitterColor(baseColor, leaf.data.name, colorSettings.jitter_amount != null ? colorSettings.jitter_amount : 0.1);
    }
    return baseColor;
}

function getPopupData(leaf) {
    return { ...leaf.data._row };
}

function renderCells(svg, leaves, root, voronoi_settings, colors, popup, colorSettings) {
    const svgSel = d3.select(svg);

    let g = svgSel.selectAll("g.cells").data([null]);
    g = g.enter().append("g").attr("class", "cells").merge(g);

    popup.clickout();

    g.selectAll("path")
        .data(leaves, d => d.data.name)
        .join("path")
        .attr("d", d => polygonPath(d.polygon))
        .attr("fill", d => getCellColor(d, root, colors, colorSettings))
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

export function drawVoronoi(svg, hierarchy, width, height, voronoi_settings, colors, popup, localization, number_format, colorSettings) {
    if (!hierarchy) return;

    computeLayout(hierarchy, voronoi_settings, height, width);

    const leaves = hierarchy.leaves().filter(d => d.polygon && d.polygon.length > 0);

    // Use color_category column if available, otherwise fall back to first level names
    const hasColorCategory = leaves.some(d => d.data._row && d.data._row.color_category != null);
    const colorDomain = hasColorCategory
        ? [...new Set(leaves.map(d => String(d.data._row.color_category)))]
        : (hierarchy.children || []).map(d => d.data.name);
    colors.updateColorScale(colorDomain);
    configurePopup(popup, leaves, localization, number_format);
    renderCells(svg, leaves, hierarchy, voronoi_settings, colors, popup, colorSettings);
}