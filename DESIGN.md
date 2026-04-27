# Onyx OS 95 — Design Brief

## Tone
Retro-industrial nostalgia with authentic Windows 95/98 chrome. Beveled 3D effects, pixel-perfect edges, system-accurate UI chrome.

## Palette

| Name | OKLCH | Hex (approx) | Usage |
|------|-------|--------------|-------|
| System Gray | 0.74 0 0 | #C0C0C0 | Primary background, buttons, cards |
| Teal Accent | 0.55 0.22 200 | #0078D4 | Window title bars, focus states, chrome accents |
| Warning Red | 0.50 0.25 25 | #C41E3A | Destructive actions, alerts |
| Highlight (bevel) | 0.95 0 0 | #DFDFDF | Beveled highlight edge (top-left) |
| Shadow (bevel) | 0.35 0 0 | #808080 | Beveled shadow edge (bottom-right) |
| Text | 0.20 0 0 | #000000 | Foreground text, primary content |

## Typography
- **Display**: Georgia (serif fallback for MS Sans UI)
- **Body**: Tahoma, Verdana (9–11px for period accuracy)
- **Mono**: Courier New (11px for terminal/notes)
- **Type scale**: 11px body, 9px small labels, 13px headers — minimal variation for authentic retro feel

## Shape Language
- **Border radius**: 0px (pixel-perfect 90s aesthetics)
- **Bevels**: 1–2px raised/pressed shadows with highlight + shadow colors
- **Spacing**: 2px padding for buttons, 1px borders for windows, 4px gutters for icon labels

## Structural Zones
| Zone | Treatment | Purpose |
|------|-----------|---------|
| Window Title | Teal background (accent), white text, beveled frame | Draggable window header |
| Window Frame | 2px beveled border (highlight + shadow) | Contain application chrome |
| Content Area | System gray background | Main application workspace |
| Status Bar | System gray, 22px height, bordered items | System information, file size, clock |
| Buttons | Beveled raised (default), beveled pressed (active) | Standard control, clear 3D depth |
| Text Input | Inset recessed border, light gray fill | Form fields, user input |

## Component Patterns
- **Button (.btn-95)**: Beveled raised default, beveled pressed on `:active`, 11px font, padding 3px 12px
- **Window Frame (.window-frame)**: 2px beveled border with highlight/shadow colors
- **Text Input (.text-input-95)**: Inset border, light gray background, recessed appearance
- **Status Bar (.statusbar-95)**: 22px height, flex row, bordered items for status zones

## Motion & Interaction
- **Transitions**: 0.3s cubic-bezier for state changes (default smooth)
- **Button press**: Swap border colors from highlight/shadow to shadow/highlight
- **Window drag**: Pointer interactions for draggable title bars
- **None**: Minimal animation — retro 95 aesthetic favors instant feedback

## Elevation & Depth
- **Raised (default)**: Highlight edge top-left, shadow edge bottom-right = convex 3D
- **Pressed (active)**: Shadow edge top-left, highlight edge bottom-right = concave 3D
- **Inset (inputs)**: Recessed border direction creates sunken appearance

## Signature Detail
Shiny 32-bit "O" logo with yellow swirl from bottom-left to top-right (IE-inspired). Beveled window chrome throughout UI creates unmistakable 90s computing aesthetic. No rounded corners, no modern shadows — pixel-perfect period accuracy.

## Constraints
- No rounded corners (border-radius: 0)
- No drop shadows (beveled borders only)
- Font sizes locked to 9px, 11px, 13px
- No color blending beyond bevels
- Authentic system gray palette (no pastels, no gradients outside title bars)
