/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export default {

    // Voronoi chart specific settings
    voronoi_settings: {
        chart_height: "match clip",
        chart_aspect_ratio_desktop: 1,
        chart_aspect_ratio_mobile: 1,
        chart_breakpoint: 600,

        gap: 0.15,
        group_gap: 0.6,
        clip_type: "circle",
        advanced_settings: false,
        seed: 41,
        max_iterations: 100,
        convergence_ratio: 0.005,
        min_weight_ratio: 0.005,
        alignment: "center",
        border_rounding_style: "adaptive rounding",
        border_radius: 1,
        border_rounding_reach: 0.45

    },

    legend_container: {},
    legend_categorical: {show_legend: true},

    // layout module state properties
    layout: {
        body_font: {
            name: "Roboto Condensed",
            url: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap",
        },
        footer_note: `Flourish template by <a href="https://lpicci96.github.io/LucaPicci/" target="_blank">Luca Picci</a>`,
    },
    // color module state properties
    colors: {
        categorical_palette: [
            "#0e6fc4", // blue
            "#0a9e9c", // green
            "#a60737", // red
            "#f28907", // orange
            "#823cec", // purple

        ],
        jitter_shade: true, // custom property to jitter shade
        jitter_amount: 0.1, // amount to jitter shade by (0 to 1)
    },
    popup: {}, // popup module state properties

    localization: {}, // localization module state properties
    number_format: {}, // number format module state properties

    // UI controls state properties
    controls_style: {},
    button_style: {},
    dropdown_style: {},
    slider_style: {},

    // Controls state properties
    controls_container: {},
    filter: {
        control_type: "buttons"
    },

    facets: {}, // facet module state properties

    animation_duration: 800, // animation duration for transitions (in milliseconds)

    labels: {
        show_labels: true,
        auto_contrast: false,
        size_proportionally: true,
        font_size: 1,
        min_font_size: 0.5,
        max_font_size: 1.5,
        font_weight: "bold",
        font_color: "#ffffff",
        hide_small_labels: true,
        label_filter_mode: "none",
        show_list: "",
        hide_margin: 0.1,
        show_outline: true,
        outline_color: "#000000",
        outline_size: 0.1,
        wrap_labels: true,
        show_value_labels: true,
        value_label_size: 0.85,
        value_label_opacity: 0.8,
        value_label_weight: "normal",
        adaptive_format: true,
        adaptive_space: true,
        scale_thousands: true,
        scale_thousands_suffix: "K",
        scale_millions: true,
        scale_millions_suffix: "M",
        scale_billions: true,
        scale_billions_suffix: "B",
        scale_trillions: true,
        scale_trillions_suffix: "T"
    }


}