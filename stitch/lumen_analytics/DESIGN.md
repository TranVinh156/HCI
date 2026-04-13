# Design System Specification: The Insightful Lens

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Observer"**

This design system moves beyond the "app as a tool" and positions the interface as a "Digital Observer"—a sophisticated, calm, and highly intelligent partner in the classroom. We reject the cluttered, high-intensity aesthetics of typical "dashboard" apps. Instead, we embrace a high-end editorial feel that combines the precision of a scientific instrument with the warmth of a premium educational journal.

To break the "template" look, we employ **intentional asymmetry** and **tonal layering**. Data isn't just displayed; it is curated. We utilize expansive white space (breathing room) and a "glass-on-silk" material approach to ensure that even the most complex AI-driven data feels effortless and approachable.

---

## 2. Colors & Materiality
The palette is rooted in professional authority (`primary: #00355f`) and intellectual clarity (`secondary: #006a66`).

### The "No-Line" Rule
**Borders are a failure of hierarchy.** In this system, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
- Use `surface-container-low` for large section backgrounds.
- Use `surface-container-lowest` (pure white) for high-priority cards to create a "lifted" feel without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Level:** `surface` (#f7f9fb)
- **Mid Level:** `surface-container` (#eceef0) for grouping related content.
- **Top Level:** `surface-container-highest` (#e0e3e5) for interactive navigation or utility bars.

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" Material feel:
- **Glassmorphism:** For AI overlays on live video feeds, use `surface` with 60% opacity and a `24px` backdrop blur. This ensures the UI feels like a lens overlay rather than a sticker.
- **Signature Textures:** Main CTAs and Hero Data Points should use a subtle linear gradient: `primary` (#00355f) to `primary-container` (#0f4c81) at a 135-degree angle. This adds "visual soul" and depth.

---

## 3. Typography
We utilize a dual-typeface system to balance authority with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism and premium feel. It provides a sophisticated editorial voice to high-level insights.
*   **Interface & Body (Inter):** Chosen for its unparalleled legibility in data-dense environments.

**Key Scales:**
- **Headline-LG (Manrope, 2rem):** Used for primary section titles (e.g., "Classroom Engagement Metrics").
- **Title-MD (Inter, 1.125rem):** Used for card headers and data labels.
- **Body-MD (Inter, 0.875rem):** The workhorse for all analytical descriptions.
- **Label-SM (Inter, 0.6875rem):** Used strictly for AI metadata and timestamp overlays.

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering** rather than structural shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The slight shift in hex value creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a custom shadow: `0px 20px 40px rgba(25, 28, 30, 0.06)`. The shadow color is a tinted version of `on-surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If a container sits on an identical color background, use `outline-variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Live Video Feed Containers (AI Overlays)
- **The Container:** `xl` (0.75rem) rounded corners.
- **AI Overlays:** Use "Glassmorphism" (60% surface opacity + blur). 
- **AI Tags:** Use `tertiary_container` (#3728cf) with `on_tertiary_container` (#b4b2ff) text for "Active Detection" states.

### Data Cards
- **Rule:** No dividers. Separate the title from the data point using `1.5rem` (24px) of vertical white space.
- **Background:** `surface-container-lowest`.
- **Corner Radius:** `lg` (0.5rem).

### Sophisticated Charts
- **Palette:** Use `primary` for the baseline, `secondary` for positive trends (engagement), and `tertiary` for secondary AI insights.
- **Grid Lines:** If necessary, use `outline-variant` at 10% opacity. Preferably, use no grid lines and rely on the `label-sm` typography for axis points.

### Buttons
- **Primary:** Gradient (`primary` to `primary-container`), `md` (0.375rem) roundedness, no border.
- **Secondary:** `surface-container-high` background with `on_surface` text.
- **States:** On hover, increase the gradient saturation. On press, scale the component to 98%.

### Inputs & Fields
- **Style:** Underline-only or subtle tonal fill (`surface-container-highest`). No four-sided boxes.
- **Focus State:** A 2px bottom border of `primary` (#00355f).

---

## 6. Do’s and Don’ts

### Do
- **Do** use `primary_fixed_dim` for icons to give them a softer, more integrated look than pure black.
- **Do** use `9999px` (full) rounding for chips and status indicators to contrast against the `0.5rem` card corners.
- **Do** prioritize "negative space" as a functional element to reduce teacher cognitive load.

### Don’t
- **Don't** use pure black (#000000). Always use `on_surface` (#191c1e).
- **Don't** use standard Material shadows. They are too "heavy" for a modern AI interface.
- **Don't** use 1px dividers between list items. Use a 12px vertical gap instead.
- **Don't** use high-saturation red for errors. Use `error` (#ba1a1a) paired with `error_container` for a more "sophisticated alert" rather than a "panic alert."