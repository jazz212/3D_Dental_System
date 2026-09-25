---
name: ToothPeak Dental System
description: Calm, green, clinical-but-warm design for ToothPeak Dental Clinic's public site and staff dashboard.
colors:
  forest-green: "#1F4A3D"
  forest-green-deep: "#163A2F"
  forest-ink: "#1F2D28"
  teal-green: "#00685F"
  teal-green-deep: "#004D45"
  mint-surface: "#F0FDFA"
  sage-border: "#D8DAD2"
  sage-line: "#E4E6E0"
  sage-muted: "#8A8D82"
  stone-surface: "#EDEFEE"
  white: "#FFFFFF"
  gray-line: "#E5E7EB"
  gray-border: "#D1D5DB"
  gray-muted: "#6B7280"
  alert-terracotta: "#B4432E"
  alert-blush: "#FCEEEA"
  error-red: "#DC2626"
  error-surface: "#FEF2F2"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary-staff:
    backgroundColor: "{colors.teal-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-staff-hover:
    backgroundColor: "{colors.teal-green-deep}"
  button-secondary-staff:
    backgroundColor: "{colors.white}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-public:
    backgroundColor: "{colors.forest-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-public-hover:
    backgroundColor: "{colors.forest-green-deep}"
  button-outline-public:
    backgroundColor: "{colors.white}"
    textColor: "{colors.forest-green}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  input-staff:
    backgroundColor: "{colors.mint-surface}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  input-public:
    backgroundColor: "{colors.white}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  button-primary-dialog:
    backgroundColor: "{colors.teal-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
  panel-staff:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "20px"
  card-public:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: "32px"
---

# Design System: ToothPeak Dental System

## Overview

**Creative North Star: "The Calm Clinic"**

ToothPeak should feel like walking into a quiet, well-kept clinic: clean white rooms, soft green accents, and nothing shouting for attention. Patients arriving on the public site are often anxious and many are older, so calm comes before everything else: generous white space, one green voice, plain steps. Staff in the dashboard get the same calm expressed as order: flat bordered panels, consistent light-green inputs, and a single accent reserved for the next action.

The system is restrained, not decorative. Colour does work (actions, current state, status), and the rest of the page is white and grey. Depth is mostly flat: thin borders separate things, and shadows appear only on public cards and on hover.

Today the two halves use two related greens: a deep forest green on the public site and a brighter teal green in the staff dashboard. This is inherited, not a deliberate choice, and the plan is to **unify them on one green in a later pass**. Until then, stay inside the half you're working in and don't mix the two greens on one screen.

**Key Characteristics:**
- White surfaces, one green accent per half, grey for everything structural.
- Flat by default: 1px borders, few shadows.
- System sans-serif throughout; hierarchy comes from size and weight, not from typefaces.
- Gently rounded corners: 8px on staff controls, softer 12–16px on public cards.
- Calm motion: short 150–300 ms transitions on a shared "smooth" ease.

## Colors

A restrained palette of white and grey with one green voice per half, plus a terracotta reserved for emergencies.

### Primary
- **Forest Green** (#1F4A3D): the public site's voice. Page titles, headings, the header wordmark, active nav underline, and primary "Book Appointment" buttons. Darkens to **Forest Green Deep** (#163A2F) on hover.
- **Teal Green** (#00685F): the staff dashboard's voice. Primary buttons, section icons, links, focus borders, the "today" and count highlights, and the active sidebar item. Darkens to **Teal Green Deep** (#004D45) on hover.

### Neutral
- **White** (#FFFFFF): every page and panel background.
- **Mint Surface** (#F0FDFA): the staff input fill, sidebar hover and active background, and soft highlight boxes.
- **Forest Ink** (#1F2D28): public body and nav text; near-black with a green cast.
- **Sage Border / Sage Line / Sage Muted** (#D8DAD2 / #E4E6E0 / #8A8D82): public form borders, dividers, and quiet helper text and icons in the booking form.
- **Stone Surface** (#EDEFEE): public footer background.
- **Gray Line / Gray Border / Gray Muted** (#E5E7EB / #D1D5DB / #6B7280): staff panel borders and table lines, input and secondary-button borders, and subtitles and helper text.

### Status
- **Alert Terracotta on Alert Blush** (#B4432E on #FCEEEA): the dental-emergency banner only.
- **Error Red on Error Surface** (#DC2626 on #FEF2F2): form and load errors ("Couldn't load…", validation messages).

### Named Rules
**The One Green Rule.** Each screen uses exactly one green: forest on public pages, teal in the dashboard. Never both on one screen until the planned unification.

**The Green Means Go Rule.** The green accent marks what you can act on or where you are (primary button, active nav, focus, key counts). Structure, dividers and secondary text stay grey.

**The Emergency Is Rare Rule.** Terracotta appears only for dental emergencies. It is never a decorative warm accent.

## Typography

**Display Font:** system sans-serif (`ui-sans-serif, system-ui, sans-serif`)
**Body Font:** the same

**Character:** one plain, familiar sans-serif carries everything, so the interface feels native and readable rather than styled. Note that `app/layout.js` loads Geist but never applies it, so the system font is what actually renders. Adopting Geist would be a deliberate future change, not a fix.

### Hierarchy
- **Display** (800, 3rem → 3.75rem on desktop, tight leading): public hero and page titles only ("Our Services").
- **Headline** (700, 1.875rem → 2.25rem from `sm`): staff page titles ("Overview", "Patient Record", "Clinic Settings").
- **Title** (700, 1.125rem): section and panel headings ("All Appointments", "Operating Hours", service card names).
- **Body** (400, 1rem): paragraphs and table cells. Keep public prose to 65–75 characters per line (the site uses `max-w-2xl`).
- **Label** (500, 0.875rem): form labels, buttons in dense areas, helper and status text.

### Named Rules
**The Weight Not Font Rule.** Hierarchy comes from size and weight steps. Never add a second typeface for emphasis.

**The Readable Floor Rule.** Body text never goes below 0.875rem (14px), because many patients are older. 0.75rem is only for tiny meta text like file sizes.

## Layout

- **Public site:** centered content in a `max-w-7xl` (1280px) container with 32px side padding. Heroes are centered, with prose capped near `max-w-2xl`. Card grids step from 1 column to 2 at `sm` to 3 at `lg`, with 24px gaps. Sections breathe with 64–80px vertical padding.
- **Staff dashboard:** a floating white sidebar (rounded, 16px corners, 8px from the screen edge; collapsible on desktop and a slide-in drawer on phones) next to a full-width white content area with 16px padding. Each page opens with a title and subtitle on the left and primary actions on the right, stacking on phones. Content uses 16px gaps. Two-column layouts (for example 2/3 plus 1/3) only appear from `lg`.
- **Breakpoints:** Tailwind defaults `sm` 640px, `md` 768px, `lg` 1024px. Tables scroll horizontally inside their bordered box on small screens instead of squeezing.
- **Rhythm:** a 4px base. The common steps are 8, 16, 20 and 24px, with 32px for public cards.

## Elevation & Depth

Mostly flat. Staff panels, tables and inputs sit on white with a 1px grey border and no shadow. Public cards may carry a very soft `shadow-sm`, and lift slightly on hover (a larger shadow plus a 2px rise on primary buttons). Pop-ups and dropdowns are the only things that float, with a large soft shadow.

### Shadow Vocabulary
- **Resting card** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)`): public form and info cards.
- **Hover lift** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`): public primary buttons and service cards on hover.
- **Floating** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`): modal pop-ups and hover cards.

### Named Rules
**The Flat Staff Rule.** Dashboard surfaces never use resting shadows. Borders do the separating.

## Shapes

Gently rounded, never sharp and never pill-shaped for containers. Staff controls, inputs, buttons and panels use 8px corners. Public buttons are slightly tighter at 6px, and public cards softer at 12–16px. Fully round shapes are only for status badges, avatar circles and pill toggles (like the dashboard's status filter). Borders are always 1px. The only exception is the dashed border on file drop zones.

## Components

### Buttons
Quiet and confident: solid green for the one main action, white with a grey border for everything else.
- **Shape:** 8px corners on staff, 6px on public.
- **Primary (staff):** Teal Green fill with white text, 8×16px padding. On hover it darkens to Teal Green Deep; when pressed it shrinks to 97% scale over 150 ms.
- **Primary (public):** Forest Green fill with white semibold text, 12×24px padding. On hover it darkens to Forest Green Deep and lifts 2px with the hover shadow.
- **Primary (staff pop-ups):** inside pop-ups the main action is larger: Teal Green, 12×24px padding, 0.875rem semibold, 12px corners. It currently darkens to #00524C on hover, not Teal Green Deep. That small inconsistency should be settled during the green unification.
- **Secondary:** a white fill with a 1px grey border. Staff secondary buttons turn pale grey on hover. The public outline variant uses a Forest Green border and text, and fills green on hover.
- **Focus:** a 2px Teal Green outline, offset 2px.
- **Disabled:** 50% opacity and a not-allowed cursor. Never hidden.

### Inputs / Fields
- **Staff:** Mint Surface fill, 1px Gray Border, 8px corners, 8×12px padding. On focus the border turns Teal Green, with no glow. Leading icons sit inside the field at 12px from the left, 16px and grey.
- **Public:** white fill, 1px Sage Border, 8px corners, 10×14px padding, Forest Ink text. On focus it gets a green border plus a 1px ring. Errors turn the border red.
- **Labels:** always visible above the field (0.875rem, 500). Never placeholder-only.

### Cards / Containers
- **Staff panel:** white, 1px Gray Line border, 8px corners, 20px padding, no shadow. Section title in Title style, with an optional 20px Teal Green icon before it.
- **Public card:** white, 1px border, 12–16px corners, 24–32px padding, with an optional resting shadow. Service cards gain a faint green border and a medium shadow on hover.

### Pill Toggles (staff)
- **Style:** a light grey (gray-100) rounded track with 4px padding. The selected option is a white pill with a small shadow, in Teal Green medium text. The Dashboard uses this for the status filter; Patient Records uses it for its tabs, where the white pill slides between options over 300 ms.
- **Status today:** appointment status shows as plain text in the tables, with no coloured badges yet. If badges are added, always show the status word, so colour is never the only cue.

### Pop-ups (staff)
- White, 16px corners, the Floating shadow, and a dimmed backdrop. They scale in from 95% over 200 ms, and are capped to the screen height with internal scrolling.

### Navigation
- **Public header:** wordmark on the left in Forest Green bold, and centered links at 15px medium in Forest Ink. The active link has a 2px Forest Green underline. On hover a link turns green and its underline grows from the left over 300 ms.
- **Staff sidebar:** a floating white rounded panel. Items have 12px corners. Hovering an item gives it a Mint Surface background, and the active item is Teal Green text on Mint Surface. It collapses to icons on desktop and becomes a slide-in drawer with a dimmed backdrop on phones.

### Tables (staff)
- A bordered, rounded box. The header row is light grey (gray-100) with bold left-aligned text. Rows have 12px cells and a grey bottom border. Row actions are small grey icon buttons that turn Teal Green on Mint Surface when hovered. On narrow screens the table scrolls horizontally, with a minimum width of 720px.

## Do's and Don'ts

### Do:
- **Do** use exactly one green per screen: Forest Green (#1F4A3D) on public pages, Teal Green (#00685F) in the dashboard.
- **Do** give staff inputs the Mint Surface fill (#F0FDFA) with a 1px grey border that turns Teal Green on focus, matching Add Patient and Patient Records.
- **Do** separate staff content with 1px grey borders and white panels (8px corners, 20px padding) instead of shadows.
- **Do** keep a visible label above every field, and always show status as a word, never as colour alone.
- **Do** use `lucide-react` icons at 16–20px, in grey or the section's green.
- **Do** use the shared `ease-smooth` curve for 150–300 ms state transitions, and respect `motion-reduce`.

### Don't:
- **Don't** mix Forest Green and Teal Green on one screen, and don't add a third green before the planned unification.
- **Don't** add a thick coloured left border to cards or panels. Settings dropped it, and the Dashboard stat cards are the last place it remains.
- **Don't** use emoji or hand-drawn one-off SVGs as icons.
- **Don't** use Tailwind's `slate`/`teal` scales or off-palette tints (indigo, blue backgrounds) in the staff area. Use the `gray` scale and the exact greens above.
- **Don't** use terracotta outside the emergency banner.
- **Don't** set body text below 14px, or rely on colour alone to show state.
