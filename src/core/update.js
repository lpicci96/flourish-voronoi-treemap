import data from "./data";
import state from "./state";
import { layout, colors, legend_container, legend_categorical, popup, localization, number_format } from "../init";
import { sizeSvg, svg, updateLegend } from "./draw";
import { drawVoronoi } from "./chart/voronoi";
import { processData } from "./chart/format"

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
    drawVoronoi(svg, hierarchy, width, height, state.voronoi_settings, colors, popup, localization, number_format);
    popup.update();
}
