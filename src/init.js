import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend } from "@flourish/legend";
import createInfoPopup from "@flourish/info-popup";
import initLocalization from "@flourish/number-localization";
import initNumberFormatter from "@flourish/number-formatter";
import state from "./core/state";

export var layout = initLayout(state.layout);
export var colors = createColors(state.colors);
export var legend_container = createLegendContainer(state.legend_container);
export var legend_categorical = createDiscreteColorLegend(state.legend_categorical);
export var popup = createInfoPopup(state.popup);
export var localization = initLocalization(state.localization);
export var number_format = initNumberFormatter(state.number_format);