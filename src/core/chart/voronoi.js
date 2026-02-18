// TODO: Additional advanced settings - handling small values
// TODO: Aggregation of values
// TODO: Align chart left, center or right within section



import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";
import { clipVoronoi } from "./clip";
import { seedrandom } from "./data_formatting";
import { getCellColor } from "./colors";
import { configurePopup, getPopupData } from "./popup";
import { transitionCells } from "./transitions";
import { renderLabels } from "./labels";

const _voronoiTreemap = voronoiTreemap();

/**
 * Run the d3-voronoi-treemap layout algorithm on the given hierarchy.
 * Mutates each node's `polygon` property in place.
 * @param {object} hierarchy - d3-hierarchy root node with summed values.
 * @param {object} voronoi_settings - Layout settings (clip_type, convergence_ratio, max_iterations, seed).
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 */
function computeLayout(hierarchy, voronoi_settings, height, width) {
    const clip = clipVoronoi(voronoi_settings.clip_type, height, width);

    _voronoiTreemap
        .clip(clip)
        .convergenceRatio(voronoi_settings.convergence_ratio)
        .maxIterationCount(voronoi_settings.max_iterations)
        .prng(seedrandom(voronoi_settings.seed));

    _voronoiTreemap(hierarchy);
}

/**
 * Convert a polygon (array of [x, y] points) to an SVG path `d` string.
 * @param {Array<number[]>} polygon - Array of coordinate pairs.
 * @returns {string} SVG path data string.
 */
function polygonPath(polygon) {
    return "M" + polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z";
}

/**
 * Render (or update) Voronoi cells inside the given SVG container element.
 * Binds leaf data, sets fill colors, and wires popup interactions.
 * @param {SVGElement} container - Target SVG DOM element (svg or g).
 * @param {Array} leaves - Filtered hierarchy leaves with valid polygons.
 * @param {object} root - d3-hierarchy root node.
 * @param {object} voronoi_settings - Border color/size settings.
 * @param {object} colors - Flourish color scale instance.
 * @param {object} popup - Flourish popup instance.
 * @param {object} colorSettings - Color settings (jitter_shade, jitter_amount).
 */
function renderCells(container, leaves, root, voronoi_settings, colors, popup, colorSettings, animation_duration) {
    const sel = d3.select(container);

    let g = sel.selectAll("g.cells").data([null]);
    g = g.enter().append("g").attr("class", "cells").merge(g);

    popup.clickout();

    const duration = animation_duration || 0;

    transitionCells({
        selection: g,
        leaves,
        duration,
        pathFn: d => polygonPath(d.polygon),
        fillFn: d => getCellColor(d, root, colors, colorSettings),
        applyStyle: sel => {
            sel.attr("stroke", voronoi_settings.border_color)
                .attr("stroke-width", voronoi_settings.border_size);
        },
        applyEvents: sel => {
            sel.on("mouseover", function(event, d) {
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
        }
    });

    sel.on("click", function() {
        popup.clickout();
    });

    d3.select(document).on("click.voronoi-popup", function() {
        popup.clickout();
    });
}

/**
 * Main entry point: compute the Voronoi treemap layout, configure popups,
 * and render cells into the given SVG container.
 * @param {SVGElement} container - Target SVG DOM element (svg or g).
 * @param {object} hierarchy - d3-hierarchy root node with summed values.
 * @param {number} width - Available width in pixels.
 * @param {number} height - Available height in pixels.
 * @param {object} voronoi_settings - Layout and border settings.
 * @param {object} colors - Flourish color scale instance.
 * @param {object} popup - Flourish popup instance.
 * @param {object} localization - Flourish localization instance.
 * @param {Function} number_format - Flourish number_format factory.
 * @param {object} colorSettings - Color settings (jitter_shade, jitter_amount).
 */
export function drawVoronoi(container, hierarchy, width, height, voronoi_settings, colors, popup, localization, number_format, colorSettings, animation_duration, labelSettings) {
    if (!hierarchy) return;

    computeLayout(hierarchy, voronoi_settings, height, width);

    const leaves = hierarchy.leaves().filter(d => d.polygon && d.polygon.length > 0);

    configurePopup(popup, leaves, localization, number_format);
    renderCells(container, leaves, hierarchy, voronoi_settings, colors, popup, colorSettings, animation_duration);
    renderLabels(container, leaves, labelSettings, animation_duration);
}
