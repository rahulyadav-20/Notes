# Topic Block — React.js

FILE:           src/pages/notes/frontend/React.jsx
PRIMARY_COLOR:  #0EA5E9
GRAD_START:     #0EA5E9
GRAD_END:       #38BDF8
ICON_LETTER:    R
BRAND:          React.js
EDITION:        React 18 · Hooks · Production Patterns Reference 2025

COVER:
  title:    "React.js"
  subtitle: "Modern React — Hooks to Production"
  tagline:  "Hooks in depth, state management, performance patterns, testing,
             and production architecture for real-world React applications"
  stats:    6 Parts · 24 Sections · 220+ Concepts

FRESHER ANALOGY:
  React is like a whiteboard that automatically redraws itself when you erase and update
  information. You describe WHAT should be on the board (components + state) and React
  figures out the minimum erasing and redrawing needed — never more than required.

CODE LANGUAGES: JavaScript / JSX (primary) · TypeScript (secondary)

---

## Parts & Sections

Part 1 — React Fundamentals
  1 — How React Works
    1.1 Virtual DOM and Reconciliation
    1.2 Fiber Architecture
    1.3 JSX Compilation
    1.4 Component Model: Functional vs Class
  2 — Props and State
    2.1 Prop Drilling and Component Boundaries
    2.2 Controlled vs Uncontrolled Components
    2.3 Lifting State Up
    2.4 Keys and List Rendering

Part 2 — Hooks In Depth
  3 — Core Hooks
    3.1 useState: Batching and Functional Updates
    3.2 useEffect: Dependencies and Cleanup
    3.3 useRef: DOM and Instance Values
    3.4 useContext: Provider Pattern
  4 — Advanced Hooks
    4.1 useReducer: Complex State Logic
    4.2 useMemo and useCallback: When They Help
    4.3 useLayoutEffect vs useEffect
    4.4 useId and useTransition (React 18)
  5 — Custom Hooks
    5.1 Extracting Logic into Custom Hooks
    5.2 useLocalStorage, useFetch, useDebounce
    5.3 Hook Composition Patterns

Part 3 — State Management
  6 — Local vs Global State
    6.1 Context API for Global State
    6.2 Zustand: Simple and Scalable
    6.3 Redux Toolkit: When to Use Redux
    6.4 Jotai and Atomic State
  7 — Server State
    7.1 React Query (TanStack Query)
    7.2 SWR Pattern
    7.3 Optimistic Updates
    7.4 Cache Invalidation Strategies

Part 4 — Performance & Optimisation
  8 — Rendering Performance
    8.1 Identifying Re-renders with Profiler
    8.2 React.memo: Shallow Comparison
    8.3 Lazy Loading with React.lazy and Suspense
    8.4 Code Splitting Strategies
  9 — Concurrent Features (React 18)
    9.1 Automatic Batching
    9.2 useTransition: Non-Blocking Updates
    9.3 useDeferredValue
    9.4 Streaming SSR with Suspense

Part 5 — Testing React Apps
  10 — Unit Testing with Vitest
    10.1 Testing Components with React Testing Library
    10.2 Mocking Hooks and Context
    10.3 Testing Custom Hooks
  11 — Integration & E2E Testing
    11.1 MSW: Mock Service Worker for API Testing
    11.2 Playwright for E2E Tests
    11.3 Visual Regression with Chromatic

Part 6 — Production Patterns
  12 — Architecture Patterns
    12.1 Feature-Based Folder Structure
    12.2 Compound Components
    12.3 Render Props and HOC Migration to Hooks
  13 — Forms
    13.1 React Hook Form Deep Dive
    13.2 Zod Schema Validation
    13.3 Dynamic Forms and Field Arrays
  14 — Accessibility and Error Handling
    14.1 Accessible Components: ARIA Patterns
    14.2 Error Boundaries
    14.3 Suspense for Data Fetching Patterns

---

## Required Diagrams

1. Part 1 — Virtual DOM Reconciliation (Flat SVG): Old VDOM tree → Diff → Minimal DOM patches
2. Part 1 — Fiber Architecture (Flat SVG): Work loop, render phase, commit phase
3. Part 2 — useEffect Lifecycle (Flat SVG): mount, update (deps changed), unmount + cleanup
4. Part 3 — State Management Comparison (Flat SVG table): Context vs Zustand vs Redux vs Jotai
5. Part 4 — React 18 Concurrent Rendering (Flat SVG): interruptible renders, priority lanes
6. Part 6 — Component Architecture (3D IsoBox): feature module structure, shared components, pages
