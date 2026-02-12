import data from "./data";
import state from "./state";
import { layout, colors } from "../init";
import { sizeSvg, svg } from "./draw";
import { processData, drawVoronoi } from "./chart/voronoi";

export default function() {
    layout.update();
    sizeSvg();

    const hierarchy = processData(data);
    if (!hierarchy) return;

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    drawVoronoi(svg, hierarchy, width, height, state.voronoi_settings, colors);
}