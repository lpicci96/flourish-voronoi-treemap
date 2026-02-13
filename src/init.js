import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend } from "@flourish/legend";
import state from "./core/state";

export var layout = initLayout(state.layout);
export var colors = createColors(state.colors);
export var legend_container = createLegendContainer(state.legend_container);
export var legend_categorical = createDiscreteColorLegend(state.legend_categorical);