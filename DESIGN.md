---
name: Google Labs Inspired FIFA Volunteer
colors:
  primary: "#34a853"      # Soft emerald green (Action states, safety)
  secondary: "#4285f4"    # Soft blue (Information, scripts)
  surface: "#f8f9fa"      # Off-white labs background
  surface-variant: "#ffffff" # Clean card backgrounds
  on-surface: "#1f1f1f"   # Deep charcoal primary text
  on-surface-variant: "#5f6368" # Muted body text
  warning: "#fbbc05"      # Warm mustard yellow (Congestion warnings)
  error: "#ea4335"        # Coral red (Crush anomaly alarms)
typography:
  headlineFont: Google Sans
  bodyFont: Google Sans Text
  labelFont: Google Sans Text
roundness: ROUND_FULL
---

# Google Labs Design System — MatchDay Co-Pilot

A minimalist, responsive, and highly tactile design system inspired by **labs.google**'s aesthetic, optimized for stadium volunteers during the FIFA World Cup 2026.

## Vibe & Aesthetic
* **Fluidity:** Organic, floating background shapes in pastel green (#34a853) and blue (#4285f4) that give a friendly, modern, and forward-looking AI atmosphere.
* **High Contrast/Cleanliness:** Off-white primary surface (#f8f9fa) paired with high-contrast text (#1f1f1f) to reduce fatigue and remain readable under direct sunlight or stadium tunnel lighting.
* **Pill-shaped Elements:** Heavy use of full roundness (`ROUND_FULL` / `32px` border-radius) for tags, chips, and primary buttons to make them feel friendly and easily tappable.

## Typography
* **Headlines:** Google Sans (geometric, clean, medium weights for high scannability).
* **Body & UI labels:** Google Sans Text (optimized for readability at small sizes on mobile viewports).

## Component Standards
* **Action Buttons:** Large pill-shaped buttons with soft shadow elevations (`shadow-md`).
* **Cards:** Soft corner roundness (`ROUND_TWELVE` / `12px` border-radius), bordered with subtle 1px outlines (`#e0e0e0`) instead of heavy shadows.
* **Interactive Elements:** Smooth transition effects (`transition-all duration-300`) on hovers and clicks to simulate physical, tactile response.
