import data from "./data";
import { layout } from "../init";
import { sizeSvg, svg } from "./draw";
import { processData, drawVoronoi } from "../voronoi";

export default function() {
    layout.update();
    sizeSvg();

    const hierarchy = processData(data);
    if (!hierarchy) return;

    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    drawVoronoi(svg, hierarchy, width, height);
}