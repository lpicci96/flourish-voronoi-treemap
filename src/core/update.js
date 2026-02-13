import data from "./data";
import state from "./state";
import { layout, colors, legend_container, legend_categorical } from "../init";
import { sizeSvg, svg, updateLegend } from "./draw";
import { processData, drawVoronoi } from "./chart/voronoi";

export default function() {
    const hierarchy = processData(data);
    if (!hierarchy) {
        layout.update();
        sizeSvg();
        return;
    }

    // Update legend before layout so layout allocates space for it
    updateLegend(hierarchy);
    layout.update();
    sizeSvg();

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    drawVoronoi(svg, hierarchy, width, height, state.voronoi_settings, colors);
}
