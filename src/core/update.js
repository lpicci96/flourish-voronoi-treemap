import data from "./data";
import { layout } from "../init";
import { sizeSvg } from "./draw";

export default function() {
    layout.update();
    sizeSvg();
}