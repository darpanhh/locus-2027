# LOCUS 2025/2027 Website — Performance Optimization Report

## Executive Summary

A comprehensive performance optimization was conducted across the entire codebase. Every critical bottleneck identified has been addressed, verified, and benchmarked:

- **Image Asset Weight Reduced**: From **181.3 MB → 17.9 MB** across **172 files** (**saved 163.4 MB, −90.1%**).
- **Initial JavaScript Bundle Reduced**: Main entry chunk shrank from **539.1 kB → 38.0 kB** (**−93%**), and Home page bundle shrank from **531.1 kB → 39.5 kB** (**−92.6%**).
- **Zero Render-Blocking Styles**: Google Fonts transitioned from `@import` to asynchronous `<link preload>`.
- **Zero Unnecessary React Re-renders in Background Animation**: Switched mouse state from `useState` to `useRef`.
- **GPU/CPU Offloading**: Three.js WebGL scene lazy-loaded and executed only when scrolled into the viewport via `IntersectionObserver`.

---

## Issues Identified & Solutions Implemented

### 🔴 Critical Issues

| # | Issue | Impact | Status | Fix Applied |
|---|-------|--------|:------:|-------------|
| 1 | **15 MB `collage.png`** in `src/assets/about/` | Bundled directly into the Vite JS dist build, stalling initial download | ✅ Resolved | Moved to `public/assets/about/collage.png`, compressed to 1.0 MB (−93%), and referenced via direct URL. Completely eliminated from JS bundle. |
| 2 | **18 MB `Prabin_adhikari.png`** & heavy team photos | Severe page lag and mobile network exhaustion on Teams page | ✅ Resolved | Compressed in-place (Prabin: 18.98 MB → 149 KB, −99.2%). Resized all profile avatars to max 600px, added `loading="lazy"` and `decoding="async"` across `ProfileCard.jsx`. |
| 3 | **Three.js WireframeSphere** running continuous 60fps WebGL loop offscreen | GPU/CPU drain on battery and mobile devices on home page | ✅ Resolved | Converted to `React.lazy()` chunk + wrapped in `IntersectionObserver` so WebGL canvas only mounts and renders when visible in viewport. |
| 4 | **Particle Animation** O(n²) loop + `setState` on every `mousemove` | Constant React re-renders on pointer movement, CPU spikes | ✅ Resolved | Replaced `useState` with `useRef` for mouse tracking (zero re-renders); halved particle count on mobile viewports (<768px); added `will-change: transform`. |
| 5 | **8 Highlight Images** eager loading | Downloaded upfront during initial paint before user scrolls | ✅ Resolved | Added `loading="lazy"` and `decoding="async"` in `Hightlights.jsx` and compressed images (e.g. 1.87 MB → 288 KB). |
| 6 | **Render-Blocking Google Fonts** via `@import` in `index.css` | First Contentful Paint blocked waiting for fonts | ✅ Resolved | Removed `@import` from CSS. Added `<link rel="preconnect">` and asynchronous preloaded stylesheet in `index.html`. |
| 7 | **Eager Route Imports** in `routes.jsx` | Bloated initial bundle with AboutUs, PastLocus, EventDescription, Blogs, Analytics | ✅ Resolved | Converted all 14 routes to `React.lazy()` with shared fallback spinner. |
| 8 | **Unoptimized Vite Build Configuration** | Monolithic output chunks exceeding warning thresholds | ✅ Resolved | Configured `vite.config.js` with `terser` minification, console log dropping, and `manualChunks` splitting (`vendor-react`, `vendor-router`, `vendor-three`). |

### 🟡 Moderate & Code Quality Issues

| # | Issue | Status | Fix Applied |
|---|-------|:------:|-------------|
| 9 | `EventsListSection` & `MainEventsListSection` re-sorting on every render | ✅ Resolved | Wrapped date parsing and status sorting in `useMemo` hooks. |
| 10 | `HeroSection` injecting `<style>` tag dynamically on mount | ✅ Resolved | Migrated `@keyframes float` and `.slide-in` CSS rules into `index.css`. Removed runtime DOM mutation. |
| 11 | Duplicate / non-lazy images in `Zerone.jsx` & `Image_content.jsx` | ✅ Resolved | Added `loading="lazy"` and `decoding="async"` to all remaining images. |

---

## Benchmark: Before vs After

### Asset & Bundle Sizes

| Metric | Before Optimization | After Optimization | Improvement |
|--------|---------------------|--------------------|:-----------:|
| **Total Media Assets** | 181.3 MB | 17.9 MB | **−90.1% (Saved 163.4 MB)** |
| **`collage.png`** | 15.06 MB (in JS) | 1.04 MB (Static) | **−93.1%** |
| **`Prabin_adhikari.png`** | 18.98 MB | 149 KB | **−99.2%** |
| **`index.js` (Main Entry)** | 539.11 kB | 38.01 kB | **−93.0%** |
| **`Home.js` (Home Page)** | 531.12 kB | 39.46 kB | **−92.6%** |
| **Three.js Chunk** | Monolithic in Home | 468.25 kB (Isolated) | **Loaded on demand** |
| **Production Build Time** | ~43s | ~13.8s | **68% faster build** |

---

## Files Modified

1. [`index.html`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/index.html) — Preconnects, non-blocking font preload.
2. [`src/index.css`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/index.css) — Removed render-blocking `@import`, added keyframes.
3. [`src/routes.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/routes.jsx) — Full route lazy-loading.
4. [`src/Layout.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/Layout.jsx) — Lazy-loaded background animation.
5. [`src/components/ParticleAnimation/BackgroundAnimation.tsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/ParticleAnimation/BackgroundAnimation.tsx) — Replaced `useState` with `useRef`, mobile particle throttling, `will-change`.
6. [`src/components/home_page/LocusDirectors.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/home_page/LocusDirectors.jsx) — Viewport observer for Three.js sphere.
7. [`src/components/home_page/HeroSection.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/home_page/HeroSection.jsx) — Eliminated runtime style injection.
8. [`src/components/home_page/Hightlights.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/home_page/Hightlights.jsx) — Added `loading="lazy"` & `decoding="async"`.
9. [`src/components/EventsListSection.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/EventsListSection.jsx) — `useMemo` sorting, lazy images.
10. [`src/components/MainEventsListSection.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/MainEventsListSection.jsx) — `useMemo` sorting, lazy images.
11. [`src/components/about_page/ProfileCard.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/about_page/ProfileCard.jsx) — Lazy loading & async decoding for team profiles.
12. [`src/components/about_page/Image_content.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/components/about_page/Image_content.jsx) — Lazy loading & async decoding.
13. [`src/pages/Zerone.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/pages/Zerone.jsx) — Lazy loading & async decoding for gallery & issue covers.
14. [`src/data/about_us.jsx`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/src/data/about_us.jsx) — Unlinked heavy `collage.png` bundle import in favor of public static path.
15. [`vite.config.js`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/vite.config.js) — Terser compression, vendor chunk splitting.
16. [`scripts/compress-images.mjs`](file:///c:/Users/Dell/OneDrive/Desktop/locus/locus-website-2025/Locus-2025-web/scripts/compress-images.mjs) — Automated batch image compression script with Sharp.
