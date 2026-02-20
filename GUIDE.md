A **Voronoi treemap** is a type of data visualization that uses Voronoi tessellation
to display hierarchical data proportionally. Each polygon's area is proportional to 
the value it represents, making it easy to compare parts of a whole within a hierarchy.

A Voronoi tessellation divides a plane into regions based on distance to a set of seed points. 
In a Voronoi treemap, this technique is adapted so that regions (cells) have areas 
proportional to the data values, not just equal distances. The result is an organic, 
space-filling layout that avoids the rigid rectangular shapes of traditional treemaps.

**When to Use It**

- Showing proportional part-to-whole relationships (e.g. market share, population distribution)
- Displaying one or two levels of hierarchy in a compact, natural, and visually engaging way
- When you want a more distinctive aesthetic than a bar chart or rectangular treemap

**Limitations**

- Precise value comparison is harder than with bar charts — Voronoi treemaps are better for relative size than exact values
- The layout algorithm is iterative and may produce slightly different results depending on the random seed
- Very small values can result in tiny, hard-to-read polygons

The template accepts a flat dataset with up to two hierarchy levels:

| Column             | Required | Description                                                              |
|--------------------|----------|--------------------------------------------------------------------------|
| **First level**    | Yes      | Top-level category (e.g. continent, industry)                            |
| **Second level**   | No       | Sub-category nested within the first level (e.g. country, company)       |
| **Values**         | Yes      | Numeric value determining cell size                                      |
| **Color category** | No       | Category used to color the polygons (defaults to first level if not set) |
| **Filter**         | No       | Column used to filter displayed data                                     |
| **Grid of charts** | No       | Column used to create a faceted grid of charts                           |
| **Custom tooltip** | No       | Custom text or HTML shown in the popup on hover/click                    |


This template was created by [Luca Picci](https://lpicci96.github.io/LucaPicci/). The default dataset uses population data from the [World Bank World Development Indicators (WDI)](https://datatopics.worldbank.org/world-development-indicators/) database.

Please get in touch with me for any bug reports or feature requests.

---

## Changelog


**Planned**
- Value aggregation - choose an aggregation method for duplicate entries (e.g. sum, average, none)
- Small multiple sizing - option to size small multiples based on the relative proportions of the facet data, rather than equally
- Chart sizing options - support for aspect ratios and mobile responsive layouts

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