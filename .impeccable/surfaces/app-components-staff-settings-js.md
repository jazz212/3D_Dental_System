---
version: 1
slug: "app-components-staff-settings-js"
primary_target: "app/components/staff/Settings.js"
related_targets: ["app/components/staff/OperatingHoursEditor.js"]
---

# Surface: Staff Clinic Settings

Scope: /dashboard/settings (Settings.js + OperatingHoursEditor.js). Mode: Operate.
Audience: dentists and staff, desktop mostly, sometimes phone. Job: check the week's hours at a glance and change them now and then, equally often. Clinic details (name, address, phone) stay read-only.
Constraints: must look like Overview / Patient Record; must stay calm, not busy. Hours persist to clinic_settings.operating_hours.
Unresolved: booking does not yet enforce these hours; public site hours are still hard-coded.

## Direction contract

THESIS: Read first, edit second. The page opens on the week told in one calm glance, grouped days with the same hours; editing is a deliberate mode, not a permanently open form. Refuses the default settings wall of always-live inputs.

OWN-WORLD: DESIGN.md staff world unchanged: white ground, flat 1px gray panels (8px corners, 20px padding), Teal Green #00685F for actions (Edit, Save), the today marker and small section icons as DESIGN.md allows; no third green. Mint #F0FDFA inputs and readback line in edit mode, system sans, lucide icons.

STORY: Staff see "Mon–Fri 8:00 AM – 6:00 PM · Sat–Sun Closed" and know today's status instantly; when hours change they press Edit hours, adjust days, Save, and return to the summary.

FIRST VIEWPORT: Page title and subtitle as on other pages. Left two-thirds: "Operating Hours" panel, Edit hours button at its top-right, grouped day ranges as large readable rows with today highlighted. Right third: read-only Clinic Details panel. Editing replaces the summary inside the same panel with per-day rows and Cancel / Save.

FORM: Summary first, edit on demand; position 1 of 7 on my ordered list; seed key c8c485c8. Signature interaction: the summary regroups live as days change while editing. Motion adaptation (recorded after finish review): the incoming view fades in over 200ms ease-smooth; the outgoing view unmounts instantly instead of a full cross-fade, to keep the component simple and explainable (project CLAUDE.md prefers simplicity).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
