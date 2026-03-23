# Design System Strategy: The Resolution Editorial

## 1. Overview & Creative North Star
### The Creative North Star: "The Architectural Ledger"
Logistics and complaint management often feel chaotic and reactive. This design system rejects that chaos, opting instead for a "High-End Editorial" experience that transforms a complaint system into a sophisticated resolution engine. We are moving away from the "generic SaaS dashboard" look.

Instead of a flat, boxed-in grid, we utilize **The Architectural Ledger** approach: a layout defined by authoritative typography, intentional asymmetry, and "breathable" depth. We prioritize whitespace as a structural element, treating each complaint as a high-value editorial entry. By overlapping surfaces and using exaggerated typographic scales, we convey a sense of absolute command and professional calm.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, commanding Navy, but its sophistication comes from the interplay of subtle grey tiers rather than hard lines.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or tonal transitions.
- Use `surface_container_low` (#f3f3f3) for secondary background sections.
- Use `surface_container_lowest` (#ffffff) for primary content cards.
- The shift from a `surface` (#f9f9f9) background to a `surface_container` creates a "natural" edge that feels integrated, not "caged."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base Layer:** `background` (#f9f9f9) – The canvas.
*   **Sectional Layer:** `surface_container` (#eeeeee) – To group related complaint data.
*   **Focus Layer:** `surface_container_lowest` (#ffffff) – For the actual interaction points or "The Resolution Card."

### Signature Textures (The Glass & Gradient Rule)
To prevent the navy from feeling "flat," use a subtle linear gradient on Primary CTAs:
*   **Direction:** 135°
*   **From:** `primary` (#000666) to `primary_container` (#1a237e).
*   **Glassmorphism:** For floating action panels or navigation rails, use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur. This allows the logistics data to "bleed through" the UI, softening the industrial nature of the app.

---

## 3. Typography
We use **Inter** as our single source of truth. The hierarchy is designed to feel like a high-end financial journal—bold, clear, and unyielding.

*   **Display-LG (3.5rem / 56px):** Used for "Critical Status" numbers (e.g., total days overdue).
*   **Headline-LG (2rem / 32px):** Reserved for Page Titles and Complaint IDs. Bold weight.
*   **Title-MD (1.125rem / 18px):** For section headers within a complaint file.
*   **Body-LG (1rem / 16px):** The standard for user comments and descriptions.
*   **Label-SM (0.6875rem / 11px):** All-caps, tracked out (+5%) for top-aligned form labels to provide an "architectural" feel.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f3f3f3) background. The 4% difference in luminosity provides enough contrast for the human eye without the "muddy" look of traditional shadows.
*   **Ambient Shadows:** For "Active" or "Hovered" states, use an exaggerated ambient shadow:
    *   `box-shadow: 0 20px 40px rgba(26, 28, 28, 0.06);` (Using a tinted `on_surface` color).
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline_variant` (#c6c5d4) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (The Action Anchors)
*   **Primary:** Deep Navy gradient (`primary` to `primary_container`). Pill-shaped (`rounded-full`). Padding: `1.1rem` (vertical) by `2.25rem` (horizontal). No shadow; use a slight scale-up (1.02x) on hover.
*   **Secondary:** `outline` variant. Use the "Ghost Border" rule. The text remains `primary`.

### Status Badges (The Pill)
*   **Shape:** `rounded-full`.
*   **Logic:** Do not use heavy solid colors. Use the container tokens (e.g., `error_container` for "Urgent") with `on_error_container` text. This ensures the "Editorial" feel isn't broken by neon "stop-light" colors.

### Input Fields (The Ledger Entry)
*   **Layout:** Labels are always top-aligned, using `label-sm` in `on_surface_variant`.
*   **Styling:** No bottom-line only inputs. Use a subtle `surface_container_high` fill with a `0.5rem` radius. On focus, the background shifts to `surface_container_lowest` with a "Ghost Border."

### Cards & Lists (The Divider-less Layout)
*   **Mandate:** **Forbid 1px horizontal dividers.** 
*   **Execution:** Separate list items using the `spacing-6` (1.3rem) scale. Group content using vertical whitespace and varying font weights (Title-SM vs Body-MD).

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace asymmetry. Align a headline to the left but push the status badge to a seemingly "floating" position on the right.
*   **Do** use the `spacing-16` (3.5rem) scale for margins between major sections to give the logistics data "room to breathe."
*   **Do** use `surface_tint` (#4c56af) at 5% opacity for hover states on list items to create a soft, blue-toned glow.

### Don’t:
*   **Don’t** use pure black (#000000) for text. Always use `on_surface` (#1a1c1c) to maintain a premium, ink-on-paper look.
*   **Don’t** use standard 4px or 8px corners. Use our `xl` (3rem) for large containers and `full` for badges/buttons to maintain the "Soft Professionalism" aesthetic.
*   **Don’t** use icons as primary decorators. Icons should be secondary to the authoritative typography.