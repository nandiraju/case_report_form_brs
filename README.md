# 1Cell.Ai Clinical Case Report Form (CRF)

A professional, high-fidelity clinical Case Report Form (CRF) application built with Next.js 15, Tailwind CSS v4, and shadcn/ui, designed for OncoPredikt® BreastRS analysis reporting.

## 🚀 Features

- **Dynamic Navigation & GSAP Timelines**: Features a custom step layout with a smooth GSAP-animated sliding step highlight in the sidebar, and sliding transitions between step panels.
- **Context-Aware Date Calculations**:
  - Automatically calculates patient age from Date of Birth (DOB) with manual clinician overrides.
  - Automatically displays time intervals since Diagnosis Date on subsequent clinical step fields (Oncotype DX date, cycle administration dates, survival status, death date, etc.).
- **Theme Support & Sidebar Customization**:
  - Dark and Light mode toggles persisting choice to local storage, featuring a soft dark background (`#333`) and responsive logo swapping (`logo.png` vs `logo-sphere.png`).
  - Swappable sidebar position (Left / Right alignment).
- **Print / PDF Export**:
  - Isolated full-page Print View mode allowing clinical review sheets to be printed or saved to PDF without headers, footers, sidebars, or edit controls.
- **Robust Persistence**:
  - Hydrates state from `localStorage` on page load with clean parsing safeguards for date objects.
  - Full-form discard dialogue option confirming complete reset of cache and inputs.

---

## 📁 Project Structure

```
BRS_Form/
├── public/                     # Static assets (Logos, icons, fallbacks)
│   ├── favicon.png             # Official high-resolution sphere logo icon
│   ├── logo.png                # Primary logo (dark text for light backgrounds)
│   └── logo-sphere.png         # Lighter logo (white text for dark backgrounds)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with 1Cell.Ai meta tags & fonts
│   │   ├── page.tsx            # Main Orchestration & State management
│   │   ├── globals.css         # Tailwind v4 configuration, theme variables & base layers
│   │   ├── icon.png            # Responsive favicon source (PNG)
│   │   └── apple-icon.png      # Apple touch icon (PNG)
│   │
│   ├── components/
│   │   ├── crf-form/           # Core CRF Step Panels
│   │   │   ├── demographics-step.tsx           # Step 1: Patient Demographics
│   │   │   ├── disease-history-step.tsx        # Step 2: History, ER/PR, OncotypeDX
│   │   │   ├── treatment-administered-step.tsx # Step 3: Chemotherapy, Hormonal, Radio, Surgery
│   │   │   ├── inclusion-criteria-step.tsx     # Step 4: ECOG and Stage check
│   │   │   ├── exclusion-criteria-step.tsx     # Step 5: DCIS, Metastatic, Prior Cancer checks
│   │   │   ├── disease-progression-step.tsx    # Step 6: Progression tests table
│   │   │   ├── survival-status-step.tsx        # Step 7: Survival follow-up and death details
│   │   │   ├── breastrs-outcome-step.tsx       # Step 8: OncoPredikt® BreastRS outcome
│   │   │   ├── investigator-declaration-step.tsx # Step 9: Declaration sign-off
│   │   │   ├── review-step.tsx                 # Step 10: Final summary and print layout
│   │   │   ├── sidebar.tsx                     # Step navigation sidebar (with GSAP animation)
│   │   │   └── header.tsx                      # Top navigation bar, theme & alignment toggles
│   │   │
│   │   └── ui/                 # Shared UI Components (shadcn/ui primitives)
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── checkbox.tsx
│   │       ├── input.tsx
│   │       ├── popover.tsx
│   │       └── table.tsx
│   │
│   └── lib/
│       └── utils.ts            # Utility styles helper (cn)
│
├── components.json             # shadcn configuration
├── package.json                # Project dependencies and dev scripts
└── tsconfig.json               # TypeScript compiler config
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser to view the application.

4. To generate an optimized production build:
   ```bash
   npm run build
   ```
