/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { layout } from "../../init";

/**
 * Compute the natural height/width ratio for a clip shape.
 * Uses the same vertex generation logic as clip.js.
 * Returns null for shapes that should use the default height (e.g. rectangle).
 */
function getShapeAspectRatio(shape) {
    if (shape === "rectangle") return null;
    if (shape === "square") return 1;

    var nSidesMap = {
        circle: 64,
        triangle: 3,
        pentagon: 5,
        hexagon: 6,
        rhombus: 4
    };

    var nSides = nSidesMap[shape];
    if (!nSides) return null;

    var xs = [], ys = [];
    for (var i = 0; i < nSides; i++) {
        var angle = -Math.PI / 2 + (2 * Math.PI * i) / nSides;
        xs.push(Math.cos(angle));
        ys.push(Math.sin(angle));
    }

    var bboxW = Math.max.apply(null, xs) - Math.min.apply(null, xs);
    var bboxH = Math.max.apply(null, ys) - Math.min.apply(null, ys);

    return bboxH / bboxW;
}

export function updateChartHeight(voronoiSettings, width) {
    var chartHeight = voronoiSettings.chart_height;

    if (chartHeight === "square") {
        layout.setHeight(width);
    } else if (chartHeight === "match clip") {
        var ratio = getShapeAspectRatio(voronoiSettings.clip_type);
        if (ratio !== null) {
            layout.setHeight(Math.round(width * ratio));
        } else {
            layout.setHeight(null);
        }
    } else if (chartHeight === "custom") {
        var isMobile = window.innerWidth < voronoiSettings.chart_breakpoint;
        var aspectRatio = isMobile
            ? voronoiSettings.chart_aspect_ratio_mobile
            : voronoiSettings.chart_aspect_ratio_desktop;
        layout.setHeight(Math.round(width * aspectRatio));
    } else {
        layout.setHeight(null);
    }
}
