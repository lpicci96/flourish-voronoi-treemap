export default {

    // Voronoi chart specific settings
    voronoi_settings: {

        border_color: "#ffffff",
        border_size: 1,
        clip_type: "circle",
        advanced_settings: false,
        seed: 41,
        max_iterations: 100,
        convergence_ratio: 0.005,
        min_weight_ratio: 0.01,
        alignment: "center",
        border_rounding_style: "adaptive",
        border_radius: 3,
        max_angle_factor: 2.5,
        max_edge_consumption: 0.6

    },

    legend_container: {},
    legend_categorical: {show_legend: true},

    // layout module state properties
    layout: {
        footer_note: `Flourish template by <a href="https://lpicci96.github.io/LucaPicci/" Luca Picci" target="_blank">Luca Picci</a>`,
    },
    // color module state properties
    colors: {
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
        size_proportionally: true,
        font_size: 1,
        min_font_size: 0.5,
        max_font_size: 1.5,
        font_weight: "normal",
        font_color: "#ffffff",
        hide_small_labels: true,
        show_list: "",
        hide_margin: 0.1,
        show_outline: true,
        outline_color: "#000000",
        outline_size: 0.1,
        wrap_labels: true
    }


}