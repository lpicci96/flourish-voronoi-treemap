import data from "./data";
import { layout } from "../init";
import {processData} from "../voronoi";

let svg;

export function sizeSvg() {
    const width = layout.getPrimaryWidth();
    const height = layout.getPrimaryHeight();
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

export default function() {
    const container = layout.getSection("primary");

    layout.update();

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.border = "1px solid red";
    container.appendChild(svg);
    sizeSvg();

    console.log("data", data);
    console.log("processed data", processData(data));
}

export { svg };
