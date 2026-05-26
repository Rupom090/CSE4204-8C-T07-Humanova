# ⚖️ Humanova AI Trust Governance & Verification Platform

> **A premium, high-octane visual and spatial AI safety console.** Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Three.js. 

---

## 🎨 Creative Statement: Crafted With Pure Effort (No Templates)

This platform was built **100% from scratch with deep dedication, visual curation, and manual engineering**. Absolutely **zero pre-made UI templates or design kits were used**. 

Every single responsive panel, vector connection grid, WebGL camera equations, procedural sound envelope, elastic physics cursor, and custom canvas-drawn wave was custom-programmed to create an award-winning, magazine-inspired tactile cyber-security environment inspired by high-end publications like *The Red Bulletin*.

---

## 🌟 Visual & Interactive Feats (Built Natively)

### 🪐 1. 3D WebGL Mouse-Tilt Camera Parallax
*   **Methodology:** Programmed using raw **Three.js** perspective camera algorithms. 
*   **The Effect:** Captures real-time elastic mouse vectors (`mousemove`) and applies a subtle, non-snapping camera tilt. As you move your mouse, the shimmery cosmos background, glowing mountains, and active crimson atmosphere drift in real spatial 3D depth.

### 🔊 2. Procedural Web Audio UI Synthesizer
*   **Methodology:** Utilizes the native browser **Web Audio API** (`OscillatorNode` and `GainNode` envelopes) to synthesize digital interface sounds programmatically with zero assets load overhead.
*   **The Sounds:** 
    *   *Hover Ticks:* Delicate high-frequency sine waves playing upon hovering buttons and anchors.
    *   *Preset Snaps:* Mechanical triangle wave sweeps triggering upon click states.
    *   *Audit Sweep:* Deep, shimmery cyber-frequency sweeping resonance echoing during Sandbox scans.
*   **Zustand Mute Controls:** Integrated a sleek speaker controller in the navigation bar backed by Zustand state persistence.

### 🎯 3. Elastic Magnetic Spring Cursor Blob
*   **Methodology:** Powered by custom Framer Motion spring physics (`damping: 28`, `stiffness: 220`, `mass: 0.8`).
*   **The Effect:** Hides default pointers on desktop viewports and tracks the mouse with beautiful kinetic drag. Whenever the pointer hovers near buttons, nodes, or tags, the cursor magnetically shifts, expands, and clings directly to the element's boundaries.

### 🌊 4. Animated Factual Oscilloscope
*   **Methodology:** Implemented using pure **HTML5 Canvas 2D** vector wave algorithms.
*   **The Effect:** Renders multi-layer sine waves pulsing slowly in a monospaced calibration grid. When audits execute, the amplitude, frequency, and signal glitches warp by **`6x`** instantly, creating a real-time reactive feedback loop in sync with the audio synthesizer.

### 📐 5. Printed Newsprint "Crop Marks" & Calibration Cards
*   **Methodology:** Custom Corner indicators programmed natively in Tailwind v4 and placed inside glass cards.
*   **The Details:** Features subtle physical printing-press registration targets (`+ Ingest`), coordinate alignment grids (`[ 09-C ]`), trim ratios (`SCALE 1:1.02`), and Cyan-Magenta-Yellow-Black color chips along card borders to reinforce the tactile paper theme.

### 📝 6. Scroll-Triggered Cipher Scramblers
*   **Methodology:** Programmed an intersection-observer text scrambler.
*   **The Effect:** As headings enter the viewport, characters scramble mechanically through cryptographic sequences before decodifying from left to right back into solid heavy monospaced text.

---

## ⚙️ Technology Stack

*   **Core:** React 19 (SPA Architecture) + TypeScript + Vite
*   **Styling Engine:** Tailwind CSS v4 (utilizing the direct Vite compiler `@tailwindcss/vite`)
*   **Motion & Easing:** GSAP + Framer Motion (for physics spring components)
*   **Momentum Scroll:** Lenis Kinetic Scroll Engine (fully synchronized with GSAP ScrollTrigger ticker)
*   **State Management:** Zustand (fully persistence-capable telemetry stores)
*   **Telemetry Analytics:** Recharts Responsive Vector curves
*   **WebGL Backdrop:** Three.js (WebGLRenderer + UnrealBloomPass shaders)
*   **Portal Toasts:** Ark UI Floating glass-card toaster systems

---

## 📁 Repository Structure

```
humanova/
├── src/
│   ├── app/            # Global Router and navigation portals
│   ├── assets/         # Procedural fonts and style overlays
│   ├── components/
│   │   ├── layouts/    # App shell, Navbar organization switchers, responsive Sidebar
│   │   ├── shared/     # Custom crop frames, circular confidence meters, factual waves
│   │   └── ui/         # Letter-swappers, floating parallax containers, tilt backdrops
│   ├── hooks/          # Custom hooks (e.g. mouse position refs)
│   ├── pages/          # 9 responsive pages (Dashboard, Studio, Audits, Analytics, etc.)
│   ├── services/       # Mock API analytics layers and procedural sound services
│   ├── stores/         # UI sound, scan telemetry, and authenticated Zustand stores
│   ├── types/          # Strict TypeScript declarations
│   ├── index.css       # Root variable theme tokens & newsprint SVG noise grain
│   └── main.tsx        # Mounting portal
├── package.json        # Configurations & packages
└── eslint.config.js    # Strict code quality metrics
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local dev environment:**
   ```bash
   npm run dev
   ```

3. **Verify compile check for production packaging:**
   ```bash
   npm run build
   ```
