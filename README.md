# ShopEasy — Product Listing & Detail App

A small Amazon-style product catalog built for the Leegality Frontend Engineer assessment, using the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Tech stack
- React 18 (functional components + hooks)
- React Router v6
- Vite (dev server / bundler)
- Plain CSS (no UI framework, per the assessment's "avoid heavy UI libraries" note)

## Setup instructions

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# App runs at http://localhost:5173

# 3. Build for production (optional)
npm run build
npm run preview
```

No environment variables or API keys are required — DummyJSON is a public, unauthenticated API.

## Features implemented

**Product Listing Page** (`/`)
- Product grid (image, title, price, rating) fetched from DummyJSON
- Sidebar filters: category, price range (min/max), brand (multi-select)
- Search bar in the header (filters by title)
- Pagination (8 products per page)
- Loading spinner and error state with a "Try Again" retry
- Empty state when no products match the active filters
- All filters combine together (AND logic) and changing any filter resets pagination to page 1

**Product Detail Page** (`/product/:id`)
- Image, title, price, rating, brand, category, description
- Reviews section (rendered from the API's `reviews` array, when present)
- Back button that returns to the listing with previous filters/page intact

## Architectural decisions

- **Filter/pagination state lives in the URL (`useSearchParams`)** rather than in component state or a global store. This was the key decision that makes "Back preserves my filters" work automatically — the listing page's URL (e.g. `/?category=laptops&minPrice=200&page=2`) *is* the state, so browser back/forward navigation restores it for free, no extra persistence layer needed.
- **Hybrid fetching strategy**: Category selection re-queries the API (`/products/category/{slug}`), since that's server-supported. Price range and brand, however, aren't filterable server-side on DummyJSON, so the app fetches a working set (capped at 100 products — the API's own max per request) for the selected category and filters/paginates that set client-side. This is called out explicitly in code comments in `src/api/products.js` and `src/pages/ProductListing.jsx`.
- **Brand list is derived, not hardcoded**: brands shown in the sidebar are computed from whatever products are currently loaded, so the brand list is always accurate for the active category rather than a static, possibly-stale list.
- **Component structure**: `Header`, `Filters`, `ProductCard`, `Pagination`, and `StarRating` are all presentational and reusable; the two page components (`ProductListing`, `ProductDetail`) own all data-fetching and state.

## Assumptions made
- DummyJSON's category slugs (e.g. `mens-watches`) are used directly as the filter value and the category endpoint parameter.
- A 100-product cap per category is treated as "all products" for filtering purposes — reasonable for this assessment's scope and dataset size, but would need a different approach (real server-side filtering, or a backend proxy) at production scale.
- Reviews are only shown if the API response includes a `reviews` array (some older cached DummyJSON responses may not).
- Brand filtering is multi-select (a product matches if its brand is in the selected set), per the "single or multi-select" allowance in the brief.

## Improvements with more time
- Debounce the search input instead of filtering on every keystroke.
- Add a dedicated `/products/search` API call for search instead of client-side title matching, so search works across the full catalog rather than just the loaded working set.
- Add sort controls (price, rating) — DummyJSON supports `sortBy`/`order`.
- Add skeleton loading cards instead of a single spinner for a smoother perceived-performance feel.
- Write unit tests (React Testing Library) for the filter-combination logic and pagination math.
- Add a proper 404/redirect for invalid product IDs on the detail page.
