# US Accidents Visualization

An interactive visualization of US traffic accidents (2016–2023) built for **CSC 805 Data Visualization** at San Francisco State University. The goal is to help surface high-risk traffic areas for potential government intervention.

**Team (Group 4):** Alexander Nikols · Zoe Long · Andra Bhargav Teja

---

## Tech Stack

- **React 19 + Vite** — UI and build tooling
- **D3.js** — analytics charts (bars, donut, heatmap)
- **Leaflet + MarkerCluster** — map view with clustered accident markers
- **Tailwind CSS v4** — styling
- **Python** — offline data preprocessing (`preprocess.py`)

No backend: everything is served from pre-aggregated static JSON under `public/data/`.

---

## Getting Started

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

The raw dataset lives in `US_Accidents_Full2022_parts/` (~1.76M rows, 4 CSVs). Running `python preprocess.py` regenerates the aggregated JSON files in `public/data/`.

---

## Pages

| Route         | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `/explorer`   | Interactive map with clustered markers, filters, timeline slider, detail panel |
| `/analytics`  | Dashboard with KPI cards and six D3 charts                              |
| `/about`      | Project overview, danger-score formula, dataset citation, team          |

---

## Project Structure

```
src/
├── App.jsx                   # router
├── main.jsx                  # entry point
├── index.css                 # Tailwind + timeline slider styles
│
├── lib/                      # pure utility functions (no React)
│   ├── constants.js          #   severity colors/labels, weather options
│   ├── format.js             #   number / date formatting
│   ├── dateUtils.js          #   parseDate
│   ├── dateRange.js          #   date-range computation and sync helpers
│   ├── filters.js            #   matchesFilters, withinTimestampRange
│   └── markerFactory.js      #   Leaflet circle + cluster icons
│
├── hooks/                    # reusable React hooks
│   ├── useJsonData.js        #   fetch JSON + loading state
│   ├── useChartResize.js     #   ResizeObserver-driven D3 redraw
│   ├── useAccidentRecords.js #   chunked loader with in-memory cache
│   └── useExplorerMap.js     #   Leaflet map + cluster-group lifecycle
│
├── components/
│   ├── common/               # reusable across pages
│   │   ├── InfoTooltip.jsx
│   │   ├── ChartCard.jsx     #   standard chart card wrapper
│   │   └── SkeletonCard.jsx  #   loading placeholder
│   │
│   ├── layout/               # top nav
│   │   ├── NavItem.jsx
│   │   └── navIcons.jsx
│   ├── Layout.jsx
│   │
│   ├── explorer/             # Explorer page building blocks
│   │   ├── explorerCache.js  #   module-level cache (survives route changes)
│   │   ├── FilterSidebar.jsx
│   │   ├── DateRangeFilter.jsx
│   │   ├── SeverityFilter.jsx
│   │   ├── WeatherFilter.jsx
│   │   ├── TimelineSlider.jsx
│   │   ├── DetailPanel.jsx
│   │   └── LoadingProgress.jsx
│   │
│   └── analytics/            # one component per dashboard chart
│       ├── KpiCards.jsx + kpiIcons.jsx
│       ├── AccidentsOverTime.jsx
│       ├── SeverityDistribution.jsx
│       ├── TopCounties.jsx
│       ├── WeatherConditions.jsx
│       └── DayHourHeatmap.jsx
│
└── pages/
    ├── Explorer.jsx          # thin orchestrator over explorer/ components
    ├── Analytics.jsx         # grid of analytics/ components
    └── About.jsx
```

### Architecture at a glance

- **`lib/`** — pure functions, no React. Safe to unit-test in isolation.
- **`hooks/`** — all side effects (fetch, Leaflet, ResizeObserver) live here, so components stay declarative.
- **`components/common/`** — building blocks reused by multiple pages.
- **`components/<page>/`** — components that only belong to one page.
- **`pages/`** — compose hooks + components; contain orchestration logic only.

---

## How to Add Features

### Add a new analytics chart

1. Drop a new file under `src/components/analytics/`, e.g. `MyChart.jsx`.
2. Use the same three-piece template as existing charts:
   ```jsx
   const { data, loading } = useJsonData('/data/my_data.json')
   useChartResize(containerRef, () => draw(svgRef.current, containerRef.current, data), [data])
   return <ChartCard title="…" subtitle="…">{/* svg */}</ChartCard>
   ```
3. Import it in [src/pages/Analytics.jsx](src/pages/Analytics.jsx) and place it in the grid.

### Add a new Explorer filter

1. Create a new filter component under `src/components/explorer/` (see `SeverityFilter.jsx` as reference).
2. Mount it inside [FilterSidebar.jsx](src/components/explorer/FilterSidebar.jsx).
3. Extend the filter predicate in [src/lib/filters.js](src/lib/filters.js).
4. Initialize the new field in `DEFAULT_FILTERS` inside [src/pages/Explorer.jsx](src/pages/Explorer.jsx).

### Update shared styling or constants

- Severity colors/labels → [src/lib/constants.js](src/lib/constants.js)
- Number/date formatting → [src/lib/format.js](src/lib/format.js)
- Chart card layout → [src/components/common/ChartCard.jsx](src/components/common/ChartCard.jsx)

---

## Data Files (`public/data/`)

| File                     | Consumer                   |
| ------------------------ | -------------------------- |
| `summary.json`           | `KpiCards`                 |
| `by_month.json`          | `AccidentsOverTime`        |
| `by_severity.json`       | `SeverityDistribution`     |
| `by_county_danger.json`  | `TopCounties`              |
| `by_weather.json`        | `WeatherConditions`        |
| `by_day_hour.json`       | `DayHourHeatmap`           |
| `map/manifest.json` + chunked JSONs | `useAccidentRecords` (Explorer map) |

### Danger Score

```
Danger Score = (S1·N1 + S2·N2 + S3·N3 + S4·N4) / T
```

Where `Sx` is a severity level (1=Minor … 4=Fatal), `Nx` is the number of accidents at that severity, and `T` is the total accident count in the area. Scores range from 1.0 (all minor) to 4.0 (all fatal).

---

## Dataset

[US Accidents (2016–2023)](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents) by Sobhan Moosavi et al. See the About page for full citations.
