// TODO: Additional advanced settings - handling small values
// TODO: Aggregation of values



import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";
import { clipVoronoi } from "./clip";
import { seedrandom } from "./data_formatting";
import { getCellColor } from "./colors";
import { configurePopup, getPopupData } from "./popup";
import { transitionCells } from "./transitions";
import { renderLabels } from "./labels";
import { createAdaptiveFormatter } from "./number_formatting";

const _voronoiTreemap = voronoiTreemap();

/**
 * Run the d3-voronoi-treemap layout algorithm on the given hierarchy.
 * Mutates each node's `polygon` property in place.
 * @param {object} hierarchy - d3-hierarchy root node with summed values.
 * @param {object} voronoi_settings - Layout settings (clip_type, convergence_ratio, max_iterations, seed).
 * @param {number} height - Available height in pixels.
 * @param {number} width - Available width in pixels.
 * @param {Array} clip - Clipping polygon vertices.
 */
function computeLayout(hierarchy, voronoi_settings, height, width, clip) {
    _voronoiTreemap
        .clip(clip)
        .convergenceRatio(voronoi_settings.convergence_ratio)
        .maxIterationCount(voronoi_settings.max_iterations)
        .minWeightRatio(voronoi_settings.min_weight_ratio)
        .prng(seedrandom(voronoi_settings.seed));

    _voronoiTreemap(hierarchy);
}

/**
 * Compute the horizontal translation needed to shift a centered shape
 * to the desired alignment position.
 * @param {Array} clip - Centered clipping polygon vertices.
 * @param {number} width - Available width in pixels.
 * @param {string} alignment - Desired alignment (left, center, right).
 * @returns {number} Horizontal offset in pixels.
 */
function getAlignmentOffset(clip, width, alignment) {
    if (!alignment || alignment === "center") return 0;
    const xs = clip.map(p => p[0]);
    const shapeWidth = Math.max(...xs) - Math.min(...xs);
    const centeredOffsetX = (width - shapeWidth) / 2;
    if (alignment === "left") return -centeredOffsetX;
    if (alignment === "right") return centeredOffsetX;
    return 0;
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
function renderCells(container, leaves, root, voronoi_settings, colors, popup, colorSettings, animation_duration, gapPx) {
    const sel = d3.select(container);

    let g = sel.selectAll("g.cells").data([null]);
    g = g.enter().append("g").attr("class", "cells").merge(g);

    popup.clickout();

    const duration = animation_duration || 0;

    transitionCells({
        selection: g,
        leaves,
        duration,
        gap: gapPx,
        fillFn: d => getCellColor(d, root, colors, colorSettings),
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
export function drawVoronoi(container, hierarchy, width, height, voronoi_settings, colors, popup, localization, number_format, colorSettings, animation_duration, labelSettings, number_format_state, dataColumnNames) {
    if (!hierarchy) return;

    // Always compute layout with centered clip so cell shapes stay consistent
    // regardless of alignment setting. Alignment is applied as a translation.
    const clip = clipVoronoi(voronoi_settings.clip_type, height, width, "center");
    computeLayout(hierarchy, voronoi_settings, height, width, clip);

    const alignX = getAlignmentOffset(clip, width, voronoi_settings.alignment);

    const sel = d3.select(container);
    let alignGroup = sel.selectAll("g.align-group").data([null]);
    alignGroup = alignGroup.enter().append("g").attr("class", "align-group").merge(alignGroup);

    const duration = animation_duration || 0;
    const alignTransform = "translate(" + (alignX || 0) + ", 0)";
    if (duration > 0) {
        alignGroup.transition().duration(duration).ease(d3.easeCubicInOut)
            .attr("transform", alignTransform);
    } else {
        alignGroup.attr("transform", alignTransform);
    }

    const alignNode = alignGroup.node();
    const leaves = hierarchy.leaves().filter(d => d.polygon && d.polygon.length > 0);

    configurePopup(popup, leaves, localization, number_format, labelSettings, number_format_state, dataColumnNames);

    // Pre-format values on leaves for value labels
    if (labelSettings && labelSettings.show_value_labels) {
        var formatter;
        if (labelSettings.adaptive_format) {
            formatter = createAdaptiveFormatter(localization, labelSettings, number_format_state);
        } else {
            formatter = number_format(localization.getFormatterFunction());
        }
        leaves.forEach(function(d) {
            if (d.data._row && d.data._row.value_label_override != null) {
                d._formattedValue = String(d.data._row.value_label_override);
            } else {
                d._formattedValue = formatter(d.data.value);
            }
        });
    }

    // Convert proportional gap (percentage of shorter dimension) to pixels
    var gapPx = voronoi_settings.gap ? voronoi_settings.gap / 100 * Math.min(width, height) : 0;

    renderCells(alignNode, leaves, hierarchy, voronoi_settings, colors, popup, colorSettings, animation_duration, gapPx);
    renderLabels(alignNode, leaves, labelSettings, animation_duration, hierarchy, colors, colorSettings);
}
