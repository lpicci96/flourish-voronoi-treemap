A **Voronoi treemap** is a type of data visualization that uses Voronoi tessellation
to display hierarchical data proportionally. Each polygon's area is proportional to 
the value it represents, making it easy to compare parts of a whole within a hierarchy.

A Voronoi tessellation divides a plane into regions based on distance to a set of seed points. 
In a Voronoi treemap, this technique is adapted so that regions (cells) have areas 
proportional to the data values, not just equal distances. The result is an organic, 
space-filling layout that avoids the rigid rectangular shapes of traditional treemaps.

**How the Algorithm Works**

The layout is computed by the d3-voronoi-treemap algorithm, which iteratively adjusts a weighted Voronoi diagram until each cell's area converges to be proportional to its data value. Seed points are placed inside the clipping shape and assigned weights derived from the target areas. On each iteration the algorithm recomputes the Voronoi diagram and nudges weights and positions to reduce the total area error. The process stops when the error falls below the **convergence ratio** or the **max iterations** limit is reached — whichever comes first.

**Interpreting Polygon Areas**

Cell areas are intended to be proportional to the data values, but the result is an approximation. Two settings affect how closely areas match the underlying data:

- **Convergence ratio / max iterations** — Lower convergence ratios and higher iteration counts produce more accurate proportions, at the cost of longer computation times.
- **Min weight ratio** — Sets a floor on cell weights as a fraction of the largest weight. Any value below this floor is inflated to the minimum. This prevents cells from becoming invisibly small, but redistributes area away from larger cells. For datasets with a wide value range (e.g. millions alongside billions), even a small min weight ratio can noticeably inflate the smallest cells. Set it to 0 for pure proportional sizing, though very small cells may become difficult to see or interact with.

**Layout Diagnostics**

After each layout, the template logs a convergence report to the browser console. This helps diagnose whether cell areas accurately represent the data. The report shows two metrics for each hierarchy group:

- **Area error** — How far each group's cell areas are from the true data proportions. This is the most important metric: it tells you whether what the user sees matches the underlying data. High area error is typically caused by the min weight ratio inflating small cells.
- **Converged** — Whether the algorithm reached its internal target (accounting for min weight ratio). If a group shows ✗, the algorithm ran out of iterations before converging — increasing max iterations may help. If a group shows ✓ but still has high area error, the gap is from min weight ratio inflation, and more iterations won't help.

A console warning is raised when any group exceeds 10% area error, indicating that cell areas may be visually misleading. Below that threshold, the report is logged as informational only.

Datasets with extreme value ranges (e.g. populations spanning thousands to billions) will naturally have higher area error due to the min weight ratio floor. To reduce this, lower the min weight ratio (at the cost of smaller cells becoming harder to see) or reduce the range in your data.

**When to Use It**

- Showing proportional part-to-whole relationships (e.g. market share, population distribution)
- Displaying one or two levels of hierarchy in a compact, natural, and visually engaging way
- When you want a more distinctive aesthetic than a bar chart or rectangular treemap

**Limitations**

- Precise value comparison is harder than with bar charts — Voronoi treemaps are better for relative size than exact values
- The layout algorithm is iterative and may produce slightly different results depending on the random seed
- Very small values can result in tiny, hard-to-read polygons
- Each row should be a distinct category: if two rows share the same first- and second-level name, they are treated as one cell. Aggregate duplicate categories in your data before charting.

**Border Rounding**

Cell borders can be rendered with rounded corners using the "adaptive rounding" style. The rounding algorithm works by cutting back each polygon edge by a configurable radius (capped to a fraction of the edge length) and inserting a quadratic Bézier curve at each corner, using the original vertex as the control point. This produces smooth, tangent-continuous corners while preserving the straight segments along longer edges.

When a Voronoi edge is too short for effective rounding (shorter than half the radius), the two quadratic corners flanking it are merged into a single cubic Bézier curve that uses both original vertices as control points. This avoids visual artefacts on tiny edges while keeping every vertex in the path, so the curve still faithfully follows the cell boundary.

**Group Spacing**

With a two-level hierarchy you can set a larger gap between first-level groups than between the sibling cells within a group, so the top-level categories read as visually separated clusters. The **Cell gap** setting controls the spacing between sibling cells; the **Group gap** setting adds extra spacing around each first-level group. Both are expressed as a percentage of chart size and use the same range (0–0.5); Group gap defaults to 0.3, a little larger than the 0.15 cell gap. Group gap only applies to two-level data and has no effect when set to 0 or on a single-level hierarchy.

**Colour Jittering**

When using a two-level hierarchy without a colour category column, all child cells within a parent group share the same base colour. Colour jittering adds a subtle, deterministic lightness shift to each child cell, making it easier to distinguish individual polygons within a group. The shift is derived from a hash of the cell's name, so the same cell always gets the same adjustment — no randomness between redraws. The jitter amount controls the maximum lightness variation; the default of 0.1 provides subtle differentiation without compromising the overall colour scheme, and the resulting lightness is kept within a safe band (0.15–0.85) so it never flattens to near-black or near-white. Jittering is automatically disabled when a colour category column is provided, since cells already have distinct colours.

The template accepts a flat dataset with up to two hierarchy levels:

| Column                 | Required | Description                                                              |
|------------------------|----------|--------------------------------------------------------------------------|
| **First level**        | Yes      | Top-level category (e.g. continent, industry)                            |
| **Second level**       | No       | Sub-category nested within the first level (e.g. country, company)       |
| **Values**             | Yes      | Numeric value determining cell size                                      |
| **Colour category**    | No       | Category used to colour the polygons (defaults to first level if not set) |
| **Filter**             | No       | Column used to filter displayed data                                     |
| **Grid of charts**     | No       | Column used to create a faceted grid of charts                           |
| **Custom tooltip**     | No       | Custom text or HTML shown in the popup on hover/click                    |
| **Info for popups**    | No       | Any number of extra columns to show as labelled rows in the popup/panel  |
| **Label override**     | No       | Custom text for cell labels (defaults to category name)                  |
| **Value label override** | No     | Custom text for value labels (defaults to formatted value)               |


This template was created by [Luca Picci](https://lpicci96.github.io/LucaPicci/). The default dataset uses population data from the [World Bank World Development Indicators (WDI)](https://datatopics.worldbank.org/world-development-indicators/) database.

Bug reports and feature requests are welcome on the [GitHub issue tracker](https://github.com/lpicci96/flourish-voronoi-treemap/issues).

**A note on popups:** the Custom tooltip and Info for popups columns are rendered as HTML, so you can include formatting and links. Only bind data you trust to these columns — do not pass untrusted third-party content, as raw HTML in those columns will be rendered as-is.

---

## Changelog

**Planned for v2**
- Value aggregation - choose an aggregation method for duplicate entries (e.g. sum, average, none)
- Small multiple sizing - option to size small multiples based on the relative proportions of the facet data, rather than equally
- Enhanced convergence logging for small multiples


**v0.8.1 - 2026-06-12**
- Deepened the default palette's teal and orange so all five colours are legible with the default white labels; blue, red and purple are unchanged, and the palette stays distinguishable under red-green colour vision deficiency
- The **Info for popups** binding now accepts numeric and date columns, not just text — numbers and dates are formatted using the column's own format
- Dropped cells whose layout polygon degenerates (fewer than 3 points) instead of drawing a malformed shape
- Documented that two rows sharing the same first- and second-level name are treated as a single cell

**v0.8.0 - 2026-06-12**
- Added **Group gap** — set a larger gap between first-level groups than between sibling cells to visually separate top-level categories (two-level data only; default 0.3)
- Added **Info for popups** — an optional binding for any number of extra columns, each shown as a labelled row in the popup and panel (numbers use the column's own formatting)
- Fixed a bounce on load where the chart would briefly appear, jump, and re-render while the layout settled; the first paint is now drawn without animation
- Renamed the **Gap** setting to **Cell gap** and **Group spacing** to **Group gap** for consistency
- Tidied editor labels and descriptions for consistency (sentence case, British spelling, and added descriptions for the core data bindings)
- Fixed cells/labels disappearing when two leaves shared the same name (common in two-level hierarchies)
- Fixed value labels showing six decimal places for small numbers below the K/M/B/T scaling threshold
- Colour jitter now stays within a safe lightness range so child-cell shading never flattens to near-black/white or reads as a different category
- Pointer cursor now appears only when the popup is actually clickable (panel modes), not for hover-only popups
- Added unit tests for number formatting, colours, clip shapes, and borders
- Corrected the documented default colour jitter amount to 0.1 (was incorrectly stated as 0.05)

**v0.7.1 - 2026-03-11**
- Label filter mode: replaced single "Show specific labels" whitelist with a 3-mode dropdown (None / Show only / Hide) supporting both whitelist and blacklist filtering
- Hide mode now respects the "Hide small labels" geometric check for remaining visible labels
- Moved "Wrap labels" setting to the Styling section of the labels settings panel

**v0.7.0 - 2026-03-11**
- Reduced default colour jitter amount from 0.1 to 0.05 for subtler child-cell variation
- Pointer cursor on cells is now conditional — only shown when popup mode is not "none"
- Debounced resize handler (150ms) to avoid redundant voronoi recomputations during window resizing


**v0.6.0 - 2026-03-10**
- Improved data handling: zero values are now preserved correctly, and negative values are clamped to zero with a console warning
- Added layout convergence diagnostics — the browser console now logs a per-group report showing area error and convergence status after each layout, with a warning when any group exceeds 10% area error
- Added touch and pen support for popups — cells now respond to pointer events on mobile and tablet devices
- Added pointer cursor on cell hover
- Lowered default min weight ratio from 0.01 to 0.005 for better visual accuracy with wide-range datasets
- Enabled adaptive number formatting by default for value labels and popups
- Updated default dataset to include only sovereign nation states, with clearer column names (Country, Region, Population)
- Removed arbitrary caps on advanced voronoi settings (max iterations, convergence ratio, min weight ratio) to allow finer user control
- Added documentation on the voronoi tessellation algorithm and interpreting polygon areas

**v0.5.0 - 2026-03-06**
- Re-implemented adaptive border rounding with an improved algorithm: corners are smoothed using quadratic Bézier curves with the original vertex as the control point, preserving straight segments along longer edges
- Added automatic merging of short-edge corners — when a Voronoi edge is too short for effective rounding, the two flanking quadratic corners are merged into a single cubic Bézier curve using both vertices as control points, avoiding visual artefacts on tiny edges
- Added configurable border radius setting (percentage of chart size) that scales proportionally across screen sizes
- Added rounding reach setting to control the maximum fraction of each edge that corner rounding can consume
- Border rounding now applies consistently across fill, border, and hit layers during transitions
- Added adaptive number formatting for value labels and popups. When data spans multiple orders of magnitude (e.g. millions and billions), each value is independently scaled to the most readable suffix (K, M, B, T). Enable it under **Number formatting > Advanced > Adaptive number formatting**. Suffixes are customisable for language flexibility. The existing prefix and decimal places settings still apply; the suffix and multiply/divide settings are bypassed when adaptive mode is on.
- Added value labels with configurable rendering for Voronoi cells
- Added label and value label override for individual cells
- Added auto contrast for label colours based on cell background
- Improved label positioning using pole of inaccessibility calculation
- Added chart height configuration with aspect ratio and breakpoint settings
- Improved transition mechanism
- Replaced borders with cell gap approach using inset polygons
- Removed fade-in/fade-out transitions
- Fixed popups to display actual CSV column headers instead of generic binding names

**v0.4.1 - 2026-02-21**
- Set data type requirement for value column to number

**v0.4.0 - 2026-02-20**
- Added border rounding styles: straight, rounded, and adaptive with configurable radius and angle settings
- Smooth per-cell border transitions that morph in sync with cell fills
- Fade-in/fade-out transitions for entering and exiting cells and labels
- Fixed colour assignment bug when using filters — colours now stay consistent across filter changes
- Increased default layout iterations from 50 to 100 for more accurate polygon proportions
- Simplified colour settings panel, removing unused numeric palette options
- Enabled label outline by default

**v0.3.1 - 2026-02-19**
- Removed debugging outlines on the SVG and container elements

**v0.3.0 - 2026-02-19**
- Added label support with proportional and fixed font sizing, text wrapping, custom visibility control, and styling options
- Added advanced voronoi setting - Min Weight Ratio to control minimum cell size

**v0.2.0 - 2026-02-18**
- Added smooth animation transitions when data changes, using polygon morphing
- Added Animation Duration setting (set to 0 to disable)
- Added data filter support

**v0.1.0 - 2026-02-17**
- Added faceted grid of charts support
- Added color jitter for second-level hierarchy polygons
- Added custom tooltip/popup support

**v0.0.1 - 2026-02-13**
- Initial release with basic Voronoi treemap, clipping shapes, colours, number formatting, and interactivity