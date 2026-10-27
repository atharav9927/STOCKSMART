# StockSmart — Design System

## Aesthetic Direction: "Instrument Panel"

StockSmart draws from the Nothing Design System philosophy — Swiss typography,
industrial design (Braun, Teenage Engineering), monochromatic with color-as-event.
The result is a **dense, calm operations tool** that warehouse and store staff use
all day. It feels like a precision instrument panel: dark surfaces, glowing data,
mechanical precision, typographic hierarchy doing all the heavy lifting.

### Tone
- **Technical & trustworthy.** Not playful, not corporate. Feels like a well-built tool.
- **Dense but calm.** Information-rich without visual noise. Spacing creates hierarchy.
- **Monochrome canvas, color as signal.** Gray scale is the palette; color only appears
  for status, errors, and interactive elements.

---

## Typography

| Role        | Font             | Usage                                    |
|-------------|------------------|------------------------------------------|
| Display     | **Doto**         | Hero KPI numbers, scan confirmation, 36px+ only |
| Body / UI   | **Space Grotesk**| Headings, body text, navigation labels   |
| Data / Labels | **Space Mono** | Table numbers, ALL CAPS labels, form input, timestamps |

### Type Scale (CSS Custom Properties)

| Token           | Size  | Line Height | Letter Spacing | Use                    |
|-----------------|-------|-------------|----------------|------------------------|
| `--display-xl`  | 72px  | 1.0         | -0.03em        | Hero KPI numbers       |
| `--display-lg`  | 48px  | 1.05        | -0.02em        | Section hero metrics   |
| `--display-md`  | 36px  | 1.1         | -0.02em        | Page titles            |
| `--heading`     | 24px  | 1.2         | -0.01em        | Section headings       |
| `--subheading`  | 18px  | 1.3         | 0              | Subsection headers     |
| `--body`        | 16px  | 1.5         | 0              | Body text              |
| `--body-sm`     | 14px  | 1.5         | 0.01em         | Secondary body, table cells |
| `--caption`     | 12px  | 1.4         | 0.04em         | Timestamps, footnotes  |
| `--label`       | 11px  | 1.2         | 0.08em         | ALL CAPS monospace labels |

### Rules
- Max **2 font families** per screen (Space Grotesk + Space Mono; Doto for hero only)
- Max **3 font sizes** per screen
- Labels are ALWAYS Space Mono, ALL CAPS, 0.06–0.1em letter-spacing
- Numbers in tables/KPIs: always Space Mono with `font-variant-numeric: tabular-nums`

---

## Color System

### Dark Mode (Default)

| Token               | Hex       | Role                              |
|---------------------|-----------|-----------------------------------|
| `--black`           | `#000000` | Primary background (OLED)         |
| `--surface`         | `#111111` | Elevated surfaces, cards          |
| `--surface-raised`  | `#1A1A1A` | Secondary elevation               |
| `--border`          | `#222222` | Subtle dividers                   |
| `--border-visible`  | `#333333` | Intentional borders               |
| `--text-disabled`   | `#666666` | Disabled, decorative              |
| `--text-secondary`  | `#999999` | Labels, captions, metadata        |
| `--text-primary`    | `#E8E8E8` | Body text                         |
| `--text-display`    | `#FFFFFF` | Headlines, hero numbers           |

### Light Mode

| Token               | Hex       |
|---------------------|-----------|
| `--black`           | `#F5F5F5` |
| `--surface`         | `#FFFFFF` |
| `--surface-raised`  | `#F0F0F0` |
| `--border`          | `#E8E8E8` |
| `--border-visible`  | `#CCCCCC` |
| `--text-disabled`   | `#999999` |
| `--text-secondary`  | `#666666` |
| `--text-primary`    | `#1A1A1A` |
| `--text-display`    | `#000000` |

### Accent & Status

| Token              | Hex                     | Usage                                   |
|--------------------|-------------------------|-----------------------------------------|
| `--accent`         | `#D71921`               | Urgent, destructive, alert — ONE per screen |
| `--accent-subtle`  | `rgba(215,25,33,0.15)`  | Accent tint backgrounds                 |
| `--success`        | `#4A9E5C`               | In-stock, completed, connected          |
| `--warning`        | `#D4A843`               | Low stock, pending, caution             |
| `--error`          | `#D71921`               | Errors = accent red                     |
| `--interactive`    | `#5B9BF6` / `#007AFF`  | Links, tappable text (dark/light)       |

### Inventory-Specific Semantic Status

| Status        | Token                | Color     | Icon          |
|---------------|----------------------|-----------|---------------|
| In Stock      | `--status-in-stock`  | `#4A9E5C` | ● filled dot  |
| Low Stock     | `--status-low`       | `#D4A843` | ▼ down arrow  |
| Out of Stock  | `--status-out`       | `#D71921` | ✕ cross       |
| In Transit    | `--status-transit`   | `#5B9BF6` | → arrow       |
| Overdue       | `--status-overdue`   | `#D71921` | ⏱ clock       |
| Discrepancy   | `--status-discrep`   | `#D4A843` | ⚠ warning     |

> Color is NEVER the only indicator — always paired with icon + label text.

---

## Spacing Scale (8px base)

| Token          | Value | Use                              |
|----------------|-------|----------------------------------|
| `--space-2xs`  | 2px   | Optical adjustments only         |
| `--space-xs`   | 4px   | Icon-to-label gaps               |
| `--space-sm`   | 8px   | Component internal padding       |
| `--space-md`   | 16px  | Standard gaps, element spacing   |
| `--space-lg`   | 24px  | Group separation                 |
| `--space-xl`   | 32px  | Section margins                  |
| `--space-2xl`  | 48px  | Major section breaks             |
| `--space-3xl`  | 64px  | Page-level vertical rhythm       |
| `--space-4xl`  | 96px  | Hero breathing room              |

---

## Border Radius

| Use            | Value    |
|----------------|----------|
| Cards          | 12–16px  |
| Compact cards  | 8px      |
| Technical      | 4px      |
| Buttons (pill) | 999px    |
| Inputs         | 8px      |

---

## Elevation & Surfaces

**No shadows. Ever.** Layering through background contrast and borders only.

| Level      | Background          | Border                      |
|------------|---------------------|-----------------------------|
| Base       | `--black`           | none                        |
| Card       | `--surface`         | `1px solid var(--border)`   |
| Raised     | `--surface-raised`  | `1px solid var(--border-visible)` |
| Overlay    | `--surface`         | `1px solid var(--border-visible)` + backdrop |

---

## Motion

- **Duration:** 150–250ms micro-interactions, 300–400ms page transitions
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` — subtle ease-out
- **No** spring, bounce, parallax, scroll-jacking
- Prefer **opacity** over position for state changes
- Hover: border/text brightens — no scale, no shadows
- `@media (prefers-reduced-motion: reduce)` → instant transitions

---

## Iconography

- **Lucide Icons** (thin variant) — monoline, 1.5px stroke, no fill
- 24×24 base grid, 20×20 live area
- Color inherits from text color
- Never filled, never multi-color, never emoji

---

## Component Visual Rules

- **Tables:** Header = Space Mono ALL CAPS, no zebra striping, active row = left 2px accent bar
- **Buttons:** Space Mono ALL CAPS, 13px, 0.06em tracking, pill shape, min 44px height
- **Inputs:** Underline style preferred, Space Mono for data entry
- **Tags/Chips:** 1px border, no fill, pill or 4px radius, Space Mono ALL CAPS
- **Empty states:** Centered text, no mascots, optional dot-grid illustration
- **Loading:** `[LOADING...]` bracket text or segmented spinner — no skeleton screens
- **Errors:** Inline `[ERROR: ...]` text near trigger — no toast popups

---

## Anti-Patterns (Never Do)

- ❌ Gradients in UI chrome
- ❌ Box shadows / blur
- ❌ Skeleton loading screens
- ❌ Toast popups (use inline status text)
- ❌ Mascots, sad-face illustrations
- ❌ Zebra-striped tables
- ❌ Filled or multi-color icons
- ❌ Border-radius > 16px on cards
- ❌ Default Material purple/pink
- ❌ Centered-card-on-gradient layouts
- ❌ Spring/bounce easing

---

## Responsive Strategy

- **Desktop-first** for management pages (dashboard, catalog, reports, admin)
- **Mobile-first** for scanning pages (scan, goods receipt, count session, pick)
- Scanning screens: 48px min touch targets, high contrast, always-focused input
- Breakpoints: 640px (mobile), 1024px (tablet), 1440px (desktop)

---

## Accessibility

- WCAG AA contrast on all text
- Visible focus rings (`2px solid var(--interactive)`, 2px offset)
- Keyboard-first navigation throughout
- ARIA roles on all tables, dialogs, navigation
- Status never conveyed by color alone — always icon + label
- `prefers-reduced-motion` respected
