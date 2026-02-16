export default {

    // Voronoi chart specific settings
    voronoi_settings: {

        border_color: "#ffffff",
        border_size: 1,
        clip_type: "circle",
        advanced_settings: false,
        seed: 42,
        max_iterations: 50,
        convergence_ratio: 0.001,

    },

    legend_container: {},
    legend_categorical: {show_legend: true},

    // layout module state properties
    layout: {
        footer_note: `Flourish template by <a href="https://lpicci96.github.io/LucaPicci/" Luca Picci" target="_blank">Luca Picci</a>`,
    },
    colors: {}, // color module state properties
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
}