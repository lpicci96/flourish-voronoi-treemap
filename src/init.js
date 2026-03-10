/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend } from "@flourish/legend";
import createInfoPopup from "@flourish/info-popup";
import initLocalization from "@flourish/number-localization";
import initNumberFormatter from "@flourish/number-formatter";
import { createGeneralControlsStyle, createButtonStyle, createDropdownStyle, createSliderStyle } from "@flourish/ui-styles";
import { createControlsContainer, createControls } from "@flourish/controls";
import initFacets from "@flourish/facets";

import state from "./core/state";

export var layout = initLayout(state.layout);
export var colors = createColors(state.colors);
export var legend_container = createLegendContainer(state.legend_container);
export var legend_categorical = createDiscreteColorLegend(state.legend_categorical);
export var popup = createInfoPopup(state.popup);
export var localization = initLocalization(state.localization);
export var number_format = initNumberFormatter(state.number_format);

export var controlsStyle = createGeneralControlsStyle(state.controls_style, ".fl-control");
export var buttonStyle = createButtonStyle(state.button_style, ".fl-control-buttons");
export var dropdownStyle = createDropdownStyle(state.dropdown_style, ".fl-control-dropdown");
export var sliderStyle = createSliderStyle(state.slider_style, ".fl-control-slider");
export var controls_container = createControlsContainer(state.controls_container);
export var filter_control = createControls(state.filter);
export var facets = initFacets(state.facets);