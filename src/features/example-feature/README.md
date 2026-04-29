
# Feature Module: example-feature

This folder is a **template** for creating new features.
To add a new feature:

1. **Run** `npx create-lscs-app feature <feature-name>`
   → This automatically sets up the full feature structure.
2. Start implementing your feature logic, UI, and hooks inside this folder.

---

## 📂 Folder Structure

- `components/`
  - `atoms/` → Smallest reusable UI elements (buttons, inputs, icons).
  - `molecules/` → Groups of atoms working together (forms, cards).
  - `organisms/` → Complex UI sections composed of molecules and atoms.
- `containers/` → Smart components that connect UI with logic, hooks, and services.
- `hooks/` → Custom React hooks specific to this feature.
- `services/` → Handles API calls, endpoints, or feature-specific logic.
- `queries/` → TanStack Query hooks/configs for data fetching.
- `types/` → TypeScript types/interfaces for the feature.
- `data/` → Static or mock data (temporary before API integration).

---

## 🧭 Guidelines

- Follow the **Atomic Design** principle inside `components/`.
- Use the **Container/Presentational** pattern for clean separation.
- Keep **business logic** in `containers/`, **UI** in `components/`.
- Always type with **TypeScript**.
- Use **Zustand** for client state (if applicable).
- Use **TanStack Query** for server-side data management.
- Avoid shared state or components unless truly global.

✅ This structure ensures each feature is **modular**, **scalable**, and **easy to maintain** within the LSCS architecture.
