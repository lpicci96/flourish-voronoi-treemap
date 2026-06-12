# Changelog
All notable changes to this template will be documented in this file.


## [Unreleased]

### Fixed
- Load "bounce" (completes the v0.8.0/v0.8.1 fixes, which only covered the first paint): the chart no longer fades out and back in shortly after it first appears. A second, animated re-render fires during load (Flourish re-applying state / font reflow in the editor) and the cell-fill `opacity` was being animated from 0 → 1 on surviving cells; the update path now snaps surviving cells to full opacity and only transitions geometry, so opacity never dips. Verified with a headless-Chrome capture of the load sequence (opacity and cell-group bounding box constant from first paint onward) (`transitions.js`)


## [v0.8.1] - 2026-06-12

### Changed
- Deepened the default palette's teal (`#0a9e9c` → `#0c7f7d`) and orange (`#f28907` → `#b85800`) so all five categorical colours are legible with the default white labels (WCAG contrast ≥ 4.5:1 against white); blue, red and purple are unchanged. The palette stays distinguishable under red-green colour vision deficiency (min CIE76 ΔE ~24 deuteranopia / ~25 protanopia) (`state.js`)
- Numeric and datetime columns can now be added to the **Info for popups** binding (it previously accepted string columns only); numbers and dates are formatted using the column's own format (`template.yml`)

### Fixed
- Cells whose layout polygon degenerates to fewer than 3 vertices (possible when the layout fails to converge) are now dropped instead of producing malformed paths and NaN geometry (`voronoi.js`)

### Internal
- Centralised the value-formatter construction shared by value labels and popups into `getValueFormatter` so the two paths can't drift (`number_formatting.js`, `popup.js`, `voronoi.js`)
- Documented that duplicate (firstLevel, secondLevel) rows are treated as a single cell (`GUIDE.md`)


## [v0.8.0] - 2026-06-12

### Added
- **Info for popups** (`info`): a new optional `columns` data binding that lets users add any number of extra columns to the popup and panel; each renders as a labelled row using its column header, with per-column number formatting taken from the dataset metadata. The existing single-column custom tooltip is unchanged (`popup.js`, `update.js`, `voronoi.js`, `template.yml`)
- **Group gap** (`group_gap`): a new setting that adds a larger gap between first-level groups than between sibling cells, so top-level categories read as separated clusters. Expressed as a percentage of chart size on the same 0–0.5 range as Cell gap, defaulting to 0.3 (a little larger than the 0.15 cell gap). Insets each first-level group polygon and clips its leaves to it; only applies to two-level data and is a no-op when set to 0 (`state.js`, `voronoi.js`, `transitions.js`, `border.js`, `template.yml`)
- Unit tests for `number_formatting`, `colors`, `clip`, and `border` (72 new tests; total now 97) including regression guards for the formatter-decimals and colour-jitter fixes and coverage of the new convex-clip helper (`tests/`)

### Fixed
- Load "bounce": the chart no longer briefly appears, jumps, and re-renders while the layout settles on load. The first paint is now drawn with animations disabled, and the facets module's animation duration is kept in step with the cell/label transitions (it previously animated its container at a fixed 1000ms, out of sync) (`draw.js`, `update.js`)
- Cells and labels with duplicate names (common in two-level hierarchies, e.g. a shared "Other" leaf under multiple groups) no longer collide in the D3 data join and disappear — the join is now keyed on each leaf's full ancestor path (`transitions.js`, `labels.js`)
- Adaptive value-label formatter: values below the smallest enabled scale (e.g. `500` with K/M/B/T scaling) no longer render with six decimal places; the plain formatter now respects the configured decimals (`number_formatting.js`)
- Colour jitter: lightness is now clamped to a safe band (0.15–0.85) instead of [0, 1], so jitter on already-light or already-dark base colours can no longer flatten to near-white/near-black or drift far enough to read as a different category (`colors.js`)

### Changed
- Renamed the **Gap** setting to **Cell gap** and **Group spacing** to **Group gap** for a consistent vocabulary across the spacing controls (`template.yml`)
- Editor labels and descriptions tidied for consistency: sentence case throughout, British spelling, and added descriptions for the First level, Second level, Values, Filter, and Grid of charts data bindings (`template.yml`)
- Pointer cursor on cells is now shown only when the popup is genuinely clickable (mode `panel` or `both`); hover-only popups (`popup`) keep the default cursor (`voronoi.js`)
- Label font sizing now reads each cell's area directly from its polygon rather than via a parallel-array index, removing a fragile ordering assumption (`labels.js`)

### Internal
- Removed dead alignment code from `clip.js` (alignment is applied as a post-layout translation in `voronoi.js`, so clip shapes are always generated centred)

### Documentation
- Added a note to GUIDE.md that the Custom tooltip and Info for popups columns render HTML, so only trusted data should be bound to them
- Corrected the documented default colour jitter amount to 0.1 in GUIDE.md and the "Jitter amount" control description — both previously stated/recommended 0.05, which never matched the code (the default has always been 0.1)
- Corrected README clip-shape count (7 shapes, not 8)


## [v0.7.1] - 2026-03-11

### Changed
- Label filter mode: replaced single "Show specific labels" whitelist with a 3-mode dropdown (None / Show only / Hide) supporting both whitelist and blacklist filtering
- Hide mode now respects the "Hide small labels" geometric check for remaining visible labels
- Moved "Wrap labels" setting to the Styling section of the labels settings panel


## [v0.7.0] - 2026-03-11

### Changed
- Reduced default colour jitter amount from 0.1 to 0.05 for subtler child-cell variation
- Pointer cursor on cells is now conditional — only shown when popup mode is not "none"
- Debounced resize handler (150ms) to avoid redundant voronoi recomputations during window resizing


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