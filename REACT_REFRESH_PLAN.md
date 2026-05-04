# 🏆 React Mastery Roadmap (Medium Difficulty)

This roadmap is designed to push you beyond "basic" React and into the patterns used by professional senior engineers. Fulfilling these checkpoints will ensure you have a deep, architectural understanding of the library.

---

## 🏗 Level 1: Architecture & Routing

_Goal: Move beyond single-file apps and master the SPA filesystem._

- [x] **Declarative Routing:** Implement `react-router-dom` with nested layouts and protected route wrappers.
- [x] **Code Splitting:** Use `React.lazy` and `Suspense` to split your routes/components and reduce initial bundle size.
- [x] **Slot Patterns:** Build a reusable `Layout` component that uses the `children` prop or named slots for flexibility.

## 🧠 Level 2: Advanced State & Custom Hooks

_Goal: Abstract logic away from the UI. Keep components "dumb" and hooks "smart"._

- [x] **State Orchestration:** Handle a complex state object using `useReducer` instead of multiple `useState` calls.
- [x] **The "Power" Hook:** Build a complex custom hook (e.g., `useAuth`, `useCart`, or `useForm`) that encapsulates business logic, effects, and state.
- [ ] **Persistence Layer:** Create a hook that automatically syncs a state slice with `localStorage` or `sessionStorage`.

## ⚡ Level 3: Data Fetching & Async UI

_Goal: Handle the "Messy" reality of APIs (Loading, Errors, Caching)._

- [ ] **Data Management:** Implement `@tanstack/react-query` (or SWR) for fetching.
- [ ] **UX States:** Implement **Skeleton Screens** for loading and **Error Boundaries** to catch and display API failures gracefully.
- [ ] **Optimistic Updates:** Implement a feature where the UI updates _before_ the server confirms (e.g., toggling a "Favorite" or adding to a list).

## 🚀 Level 4: Performance & Optimization

_Goal: Control when and why your app re-renders._

- [ ] **Memoization:** Use `useMemo` and `useCallback` to solve real performance bottlenecks (not just everywhere).
- [ ] **Referential Stability:** Explain and demonstrate why an object/function created inside a component causes unnecessary renders in children.
- [ ] **Profiler:** Use the React DevTools Profiler to identify a component that is rendering too often and fix it.

## 🛠 Level 5: Professional Tooling & UI

_Goal: Speed and Maintainability._

- [x] **Systemic Styling:** Use Tailwind CSS to build a **Design System** (standard colors, spacing, and typography) instead of ad-hoc classes.
- [ ] **Portals & Refs:** Use `createPortal` for a Modal/Overlay system and `useRef` for direct DOM access (e.g., focusing an input on load).
- [ ] **Form Complexity:** Build a multi-step form with validation that doesn't trigger a re-render on every keystroke.

---

### 🔥 The Challenge:

Instead of just building one project, try to apply these levels to **any** complex idea (e.g., a Dashboard, a Social Feed, or a Project Manager).

**Your current E-Commerce project is the perfect playground for this.** Specifically, Level 3 and 4 will be your biggest "skill builders" in that project.
