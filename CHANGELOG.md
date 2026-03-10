# Changelog
All notable changes to this template will be documented in this file.


## [v0.6.0] - 2026-03-10

### Added
- Post-hoc layout convergence diagnostics (`convergence.js`): per-group report using `d3.polygonArea` showing area error (vs original values) and convergence status (vs min-weight-inflated targets), with console warning when any group exceeds 10% area error
- Warning for dropped Voronoi cells due to missing polygons
- Warning for negative values in data (clamped to zero)
- Pointer cursor on cell hover (`style.less`)
- Unit tests for convergence check (`tests/convergence.test.mjs`): 9 tests covering single-level, two-level, min weight ratio effects, and edge cases
- Layout Diagnostics section in GUIDE.md

### Changed
- Value parsing: replaced `+d.values || 0` with `parseFloat` + `isNaN` check to preserve zero as a valid value (`data_formatting.js`)
- Popup events: `mouseover`/`mouseout` → `pointerenter`/`pointerleave` for cross-device support (`voronoi.js`)
- Default `min_weight_ratio`: 0.01 → 0.005 for better visual accuracy with wide-range datasets (`state.js`)
- Default `adaptive_format`: false → true for readable value labels out of the box (`state.js`)
- Default dataset: removed 20 non-nation-state entries (territories, SARs, dependencies); renamed columns to Country, Region, Population (`data/Data.csv`, `data/Data_filter.csv`)
- Extracted `checkConvergence` from `voronoi.js` into standalone `convergence.js` module
- Updated TODO comments to reference v2 scope (`voronoi.js`)
- Updated planned features in GUIDE.md to target v2

### Removed
- Debug comment lines in `draw.js`


## [v0.5.1] - 2026-03-06

### Changed
- Removed arbitrary caps on advanced voronoi settings (max iterations, convergence ratio, min weight ratio) to allow finer user control
- Added documentation on the voronoi tessellation algorithm and interpreting polygon areas


## [v0.5.0] - 2026-03-06

### Added
- Adaptive number formatting: per-value magnitude scaling (K, M, B, T) with customisable suffixes, found under Number formatting > Advanced
- Value labels with configurable rendering for Voronoi cells
- Label and value label override functionality for individual cells
- Auto contrast for label colours based on cell background
- Pole of inaccessibility calculation for improved label positioning and visibility
- Chart height configuration with aspect ratio and breakpoint settings
- Alignment options for Voronoi cells within the layout
- Rounding reach setting to control the maximum fraction of each edge that corner rounding can consume

### Changed
- Re-implemented adaptive border rounding with an improved algorithm: corners are smoothed using quadratic Bézier curves with the original vertex as the control point, preserving straight segments along longer edges
- Added automatic merging of short-edge corners — when a Voronoi edge is too short for effective rounding, the two flanking quadratic corners are merged into a single cubic Bézier curve using both vertices as control points, avoiding visual artefacts on tiny edges
- Border radius setting now uses a percentage of chart size for proportional scaling across screen sizes
- Renamed "rounded adaptive" border style to "adaptive rounding" for consistency
- Border rounding now applies consistently across fill, border, and hit layers during transitions
- Replaced Flubber dependency with custom polygon morphing using resampling for better point alignment
- Replaced border properties with cell gap approach using inset polygons
- Removed fade-in/fade-out transitions in favour of instant cell appearance
- Updated default convergence and weight ratio settings for Voronoi layout

### Fixed
- Popups now display actual CSV column headers instead of generic binding names (e.g. "Continent" instead of "First level")


## [v0.4.1] - 2026-02-21

### Fixed
- Data type for value column changed to requires numeric type instead of string


## [v0.4.0] - 2026-02-20

### Added
- Border rounding styles: straight, rounded, and adaptive corner rounding with configurable radius, angle factor, and max edge consumption
- Per-cell border transitions using Flubber morphing for smooth animations
- Fade-in/fade-out transitions for entering and exiting cells and labels
- Label outline enabled by default for improved readability

### Changed
- Increased default max iterations for Voronoi layout from 50 to 100 for more accurate polygon sizing
- Simplified colour settings panel by removing unused numeric palette options
- Removed border opacity setting (incompatible with per-cell border rendering)

### Fixed
- Colour domain now computed from all data rather than filtered subset, ensuring consistent colours across filter changes
- Border transitions no longer snap to final position while cells are still morphing


## [v0.3.1] - 2026-02-19

### Fixed
- Removed debugging outlines on the SVG and container elements


## [v0.3.0] - 2026-02-19

### Added
- Labels module with proportional/fixed font sizing, text wrapping, and overflow hiding
- Label styling options: font weight, color, and text outline
- Label hide margin, and show-specific-labels filter
- Smooth label transitions that follow polygon animations
- Exposed `minWeightRatio` advanced setting for minimum cell weight control
- Enhancements of the settings panel
- Added alignment options for the voronoi chart


## [v0.2.0] - 2026-02-18

### Added
- Animation transitions for Voronoi cells using flubber for smooth polygon morphing
- Animation duration setting to control transition speed (default 800ms, set to 0 to disable)
- Transitions module for managing cell enter/update/exit animations
- Data filter support

### Changed
- Updated rollup config to use `@rollup/plugin-node-resolve` and `@rollup/plugin-commonjs`


## [v0.1.0] - 2026-02-17

### Added
- Facets support for multi-level data visualization
- Jitter color functionality for Voronoi polygons
- Custom popup support
- Enhanced data processing and color handling

### Changed
- Refactored data processing and color handling
- Updated Voronoi rendering to handle facet data
- Enhanced popup rendering


## [v0.0.1] - 2026-02-13

### Added
- Initial development of the template, including basic Voronoi settings, and
support for layout, colours, number formatting, and interactivity