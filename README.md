# Flourish Voronoi Treemap

A [Flourish](https://flourish.studio/) visualization template that renders hierarchical data as proportional Voronoi tessellations — an 
organic, space-filling alternative to traditional rectangular treemaps. Built on [D3](https://d3js.org/) and 
[d3-voronoi-treemap](https://github.com/Kcnarf/d3-voronoi-treemap).

## Getting started

Requires Node.js 24+ and the [Flourish SDK](https://github.com/kiln/flourish-sdk) installed globally.

```bash
npm install            # Install dependencies
npm run build          # Bundle src/ → template.js
npm run less           # Compile less/style.less → static/style.css
flourish run           # Preview locally
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
│           ├── clip.js            # Clipping polygons for 7 shapes (circle, rect, etc.)
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

## Key conventions

- **Build artifacts are tracked** — rebuild `template.js` and `static/style.css` after source changes.
- **Edit LESS, not CSS** — modify `less/style.less`, then run `npm run less`.
- **Seeded PRNG** — layouts use Mulberry32 for reproducibility (configurable via `state.voronoi_settings.seed`).
- **`template.yml`** is the source of truth for all user-facing settings and data bindings.

## License

[Mozilla Public License 2.0](LICENSE) (MPL-2.0). This template was built as a public good for the data visualisation 
community. You may use, modify, and distribute it freely — if you modify any MPL-licensed file, those changes must be 
shared under the same terms.

MPL-2.0 is a file-level copyleft licence: modifications to these source files stay open, but the licence permits 
combination with differently-licensed code — including the proprietary Flourish SDK and `@flourish/*` modules, which 
retain their own licences ([SDK](https://github.com/kiln/flourish-sdk/blob/master/LICENSE.md),
[FCL](https://flourish.studio/terms/fcl/), 
[Terms](https://flourish.studio/terms/)).

Contributions are welcome — by opening a pull request you agree to license your changes under MPL-2.0.
