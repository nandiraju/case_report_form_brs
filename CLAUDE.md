# CLAUDE.md - Build & Dev Commands

## 🏃 Commands

- **Start Dev Server**: `npm run dev` (running locally on port `3001` or next available)
- **Production Build**: `npm run build`
- **Type Check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`

## 🎨 Guidelines

- **Theme Variable Usage**: Always use `bg-background` and `bg-card` instead of hardcoded dark theme colors like `bg-zinc-950`. The dark theme background is styled as `#333`.
- **Branding Logos**: Use `/logo.png` for light mode and `/logo-sphere.png` for dark mode.
- **GSAP Animations**: Use GSAP for smooth slide animations. Ensure any references to elements (e.g., in sidebar highlight) are wrapped in `useRef` and animated safely on state changes.
- **Local Storage Hydration**: Always handle date deserialization safely by casting ISO date strings back to `Date` objects on hydration.

See [AGENTS.md](file:///Users/srikanthnandiraju/ANTIGRAVITY_WORKSPACE/BRS_Form/AGENTS.md) for full context and memory guidelines.
