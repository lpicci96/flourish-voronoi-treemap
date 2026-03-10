# Flourish Voronoi Treemap

A [Flourish](https://flourish.studio/) visualization template that renders hierarchical data as proportional Voronoi tessellations. Each polygon's area represents a data value, producing an organic, space-filling layout that avoids the rigid rectangles of traditional treemaps.

Built on [D3](https://d3js.org/) and [d3-voronoi-treemap](https://github.com/nicenumber/d3-voronoi-treemap), bundled with Rollup, styled with LESS. Targets the Flourish SDK v3.

## Prerequisites

- Node.js 24.12.x / npm 11.x (see `engines` in `package.json`)
- [Flourish SDK](https://developers.flourish.studio/sdk/) (`@nicenumber/flourish-sdk`) installed globally for local preview

## Getting started

```bash
# Install dependencies
npm install

# Build JavaScript bundle (src/ → template.js)
npm run build

# Compile LESS styles (less/style.less → static/style.css)
npm run less

# Preview locally (requires Flourish SDK)
flourish run
```

## Project structure

```
├── src/
│   ├── index.js              # Entry point — exports Flourish lifecycle hooks
│   ├── init.js               # Initializes Flourish library modules
│   └── core/
│       ├── state.js           # All configurable settings with defaults
│       ├── data.js            # Flourish data() hook
│       ├── draw.js            # SVG container setup, legend, layout sizing
│       ├── update.js          # Main update() hook — orchestrates render pipeline
│       └── chart/
│           ├── voronoi.js         # d3-voronoi-treemap layout + three-layer SVG cells
│           ├── data_formatting.js # Flat CSV → d3-hierarchy (1–2 levels); seeded RNG
│           ├── colors.js          # Color scale + deterministic hash-based jitter
│           ├── labels.js          # Proportional/fixed font sizing, text wrapping
│           ├── border.js          # Straight, rounded, and adaptive border rounding
│           ├── clip.js            # Clipping polygons for 8 shapes (circle, rect, etc.)
│           ├── transitions.js     # Polygon morphing across fill/border/hit layers
│           ├── convergence.js     # Post-hoc layout convergence diagnostics
│           ├── popup.js           # Maps leaf data to Flourish info-popup columns
│           ├── number_formatting.js # Adaptive magnitude-based number formatting
│           └── sizing.js          # Chart dimension and aspect ratio calculations
├── less/
│   └── style.less            # Source styles (compiled to static/style.css)
├── static/                   # Compiled CSS + sample data README
├── data/                     # Sample CSV datasets
├── template.yml              # Flourish SDK config: settings panel + data bindings
├── rollup.config.js          # Rollup bundler configuration
├── template.js               # Built bundle (tracked in git)
└── GUIDE.md                  # User-facing documentation for the template
```

## Render pipeline

Each call to `update()` follows this flow:

```
update()
  ├── getFilterOptions() + processData()    → data_formatting.js
  ├── updateLegend()                        → colors.js + legend
  ├── drawVoronoi() per facet               → voronoi.js
  │     ├── computeLayout()                 → d3-voronoi-treemap algorithm
  │     ├── renderCells()                   → transitions.js (polygon morphing)
  │     │     └── Three SVG layers: fill, border, hit (invisible event target)
  │     └── renderLabels()                  → labels.js
  └── popup.update()                        → popup.js
```

## Data format

The template accepts a flat CSV with up to two hierarchy levels:

| Column | Required | Description |
|---|---|---|
| **First level** | Yes | Top-level category (e.g. continent, industry) |
| **Second level** | No | Sub-category within the first level |
| **Values** | Yes | Numeric value determining cell size |
| **Color category** | No | Category for coloring (defaults to first level) |
| **Filter** | No | Column used to filter displayed data |
| **Grid of charts** | No | Column used to create faceted small multiples |
| **Custom tooltip** | No | Custom text/HTML shown in the popup on hover |
| **Custom label** | No | Override text for cell labels |
| **Custom value label** | No | Override text for value labels |

## Key conventions

- **Build artifacts are tracked in git** — `template.js`, `template.js.map`, `static/style.css`, and `static/style.css.map` are compiled outputs. Rebuild after source changes.
- **Edit LESS, not CSS** — modify `less/style.less`, then run `npm run less`.
- **Seeded PRNG** — Voronoi layouts use a Mulberry32 seeded RNG for reproducibility. The seed is configurable in `state.voronoi_settings.seed`.
- **Deterministic color jitter** — child cell color variation is derived from a string hash, so the same cell always gets the same lightness shift.
- **Polygon morphing** — animation uses point-resampled polygon interpolation; set `animation_duration` to `0` to disable.
- **Three-layer SVG rendering** — each cell is drawn on three layers (fill, border, hit) for independent styling and invisible interaction targets.
- **`template.yml`** defines all user-facing settings and data bindings for the Flourish platform. This is the source of truth for the settings panel.

## Dependencies

### Core
- **d3** (v7) — scales, selections, hierarchy, color manipulation
- **d3-voronoi-treemap** — weighted Voronoi tessellation algorithm

### Flourish modules
- `@flourish/layout` — page layout, header/footer, responsive sizing
- `@flourish/colors` — color scale management
- `@flourish/legend` — categorical color legend
- `@flourish/info-popup` — hover/click popups
- `@flourish/controls` — filter UI controls
- `@flourish/facets` — small multiple grid support
- `@flourish/number-formatter` / `@flourish/number-localization` — number display
- `@flourish/ui-styles` — control styling

### Build tools
- **Rollup** (v4) with `@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`, `rollup-plugin-uglify`
- **LESS** with `less-plugin-clean-css`

## License

This project is licensed under the [Mozilla Public License 2.0](LICENSE) (MPL-2.0).

You are free to use, modify, and distribute this code. If you modify any of the source files, you must make your modifications available under the same MPL-2.0 terms. This ensures that improvements to the template remain open and accessible to the community.

### Why MPL-2.0?

This template was built as a public good for the data visualisation community. The MPL-2.0 was chosen deliberately to ensure that enhancements to this code stay open source, while remaining compatible with the Flourish SDK and its associated component licenses (which are proprietary). Unlike the GPL, MPL-2.0 operates at the file level — your modifications to MPL-licensed files must stay open, but the licence allows combination with differently-licensed dependencies like the Flourish SDK.

### Flourish platform and SDK

This template is designed for the [Flourish](https://flourish.studio/) platform and depends on the Flourish SDK and several `@flourish/*` modules. These dependencies are licensed separately under Flourish's own terms:

- [Flourish SDK License](https://github.com/kiln/flourish-sdk/blob/master/LICENSE.md)
- [Flourish Component License (FCL)](https://flourish.studio/terms/fcl/)
- [Flourish Terms and Conditions](https://flourish.studio/terms/)

The MPL-2.0 licence applies to the template source code in this repository (the contents of `src/`, `less/`, and configuration files authored by the contributor). It does not apply to the Flourish SDK, `@flourish/*` modules, or other third-party dependencies, which retain their own licences.

### Contributing

Contributions are welcome. By submitting a pull request, you agree that your contributions will be licensed under MPL-2.0.

© Luca Picci