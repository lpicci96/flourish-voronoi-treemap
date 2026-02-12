import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import state from "./core/state";

export var layout = initLayout(state.layout);
export var colors = createColors(state.color);