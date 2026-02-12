import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";
// import {rectangularClip, circularClip} from "./clip";
import {clipVoronoi} from "./clip";

// Simple seeded PRNG (mulberry32) to keep layout stable across redraws
function seedrandom(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

const _voronoiTreemap = voronoiTreemap();

export function processData(data) {
    const rows = Array.isArray(data) ? data : data.data;
    if (!rows || rows.length === 0) return null;

    const hasTwoLevels = !!rows[0].secondLevel;

    let rootData;
    if (hasTwoLevels) {
        const grouped = {};
        rows.forEach(d => {
            if (!grouped[d.firstLevel]) grouped[d.firstLevel] = [];
            grouped[d.firstLevel].push(d);
        });

        rootData = {
            name: "root",
            children: Object.keys(grouped).map(key => ({
                name: key,
                children: grouped[key].map(d => ({
                    name: d.secondLevel,
                    value: +d.values || 0
                }))
            }))
        };
    } else {
        rootData = {
            name: "root",
            children: rows.map(d => ({
                name: d.firstLevel,
                value: +d.values || 0
            }))
        };
    }

    return d3.hierarchy(rootData)
        .sum(d => d.value);
}

export function drawVoronoi(svg, hierarchy, width, height, voronoi_settings) {
    if (!hierarchy) return;

    // Clipping polygon (counterclockwise rectangle)
    const clip = clipVoronoi(voronoi_settings.clip_type ,height, width);

    _voronoiTreemap
        .clip(clip)
        .convergenceRatio(voronoi_settings.convergence_ratio)
        .maxIterationCount(voronoi_settings.max_iterations)
        .prng(seedrandom(voronoi_settings.seed));

    _voronoiTreemap(hierarchy);

    // Clear previous paths
    const cells = svg.querySelector(".cells");
    if (cells) cells.remove();

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "cells");

    hierarchy.leaves().forEach(leaf => {
        if (!leaf.polygon || leaf.polygon.length === 0) return;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M" + leaf.polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z");
        path.setAttribute("fill", voronoi_settings.fill);
        path.setAttribute("stroke", voronoi_settings.border_color);
        path.setAttribute("stroke-width", voronoi_settings.border_size);
        g.appendChild(path);
    });

    svg.appendChild(g);
}