<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 1Cell.Ai Case Report Form (CRF) - Agent Context & Rules

This file stores project memory and context for agent assistants (Antigravity and Claude) to resume work seamlessly.

---

## 💡 System Context & Memory

### 1. Project Overview
A 10-step clinical study Case Report Form (CRF) for OncoPredikt® BreastRS analysis. The state is centrally managed in `src/app/page.tsx` and hydrated from `localStorage` on mount.

### 2. Form Step Guide
1. **Demographics**: Date of birth, age (auto-calculated, manually overrideable), race checkboxes, menopausal status.
2. **Disease History**: Diagnosis date, status receptors (ER, PR, HER2), Ki-67 %, Histopathological type, tumor size, pTNM, nodal status, tumor grade, Oncotype DX date & score.
3. **Treatment Administered**: Toggles for Chemo, Hormonal, Radio, and Surgery; each rendering dynamic entry tables.
4. **Inclusion Criteria**: Eligibility checklist.
5. **Exclusion Criteria**: Ineligibility checklist.
6. **Disease Progression**: Table tracking progression test dates, procedures, and results.
7. **Survival Status**: Alive/Deceased status, date of last contact/death, cause of death.
8. **BreastRS Outcome**: Outcome result detail text.
9. **Investigator Declaration**: Sign-off signature and date.
10. **Final Review & Submit**: Printable summary view of all steps with edit shortcuts. Submitting validates that Step 9 signature and date are filled.

---

## 🛠️ Tech Stack & Design Rules

### 1. Tailwind v4 & Custom Themes (`src/app/globals.css`)
- **Light Theme**: Standard clean white background.
- **Dark Theme**: Clinical Charcoal background (`oklch(0.318 0 0)` ≈ `#333`) and lighter card background (`oklch(0.36 0 0)` ≈ `#3d3d3d`) for subtle contrast.
- Avoid absolute colors like `bg-zinc-950` or `bg-slate-900`. Always use `bg-background` and `bg-card` so themes apply correctly.

### 2. Logo Switching Rules
- **Light mode**: Show `/logo.png` (dark text, visible on light background).
- **Dark mode**: Show `/logo-sphere.png` (white text, visible on dark background).
- Both logo files are stored in `public/`.

### 3. Date & Time Calculations
- Perform date difference logic inline or inside state updates directly.
- Hydration parses dates from JSON string representation. Parse stored date strings into `Date` objects using `new Date(value)` during mount hydration.

### 4. Animation Guidelines
- Main step animations are driven by **GSAP**.
- Step transitions slide in and out horizontally using standard easing `power2.out`.
- Sidebar features a single absolute indicator `div` animated by GSAP targeting `y` transform to slide between steps.

---

## 🏃 Run Commands & Commands reference

- Dev Server: `npm run dev` (running on `http://localhost:3001` or fallback port)
- Production Build: `npm run build`
- Typechecking: `npx tsc --noEmit`
