# Changelog
All notable changes to this template will be documented in this file.


## [Unreleased]


## [v0.5.0] - 2026-03-06

### Added
- Value labels with configurable rendering for Voronoi cells
- Label and value label override functionality for individual cells
- Auto contrast for label colours based on cell background
- Pole of inaccessibility calculation for improved label positioning and visibility
- Chart height configuration with aspect ratio and breakpoint settings
- Alignment options for Voronoi cells within the layout

### Changed
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