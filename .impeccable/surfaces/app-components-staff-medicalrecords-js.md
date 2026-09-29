---
version: 1
slug: "app-components-staff-medicalrecords-js"
primary_target: "app/components/staff/MedicalRecords.js"
related_targets: ["app/components/staff/PatientImagingGallery.js"]
---

# Surface: Staff Patient Record (Medical Records)

Scope: /dashboard/patient-records/[id] (MedicalRecords.js + PatientImagingGallery.js). Mode: Operate.
Audience: dentists and assistants, mostly at the clinic desktop, sometimes a phone between patients. Job, equally weighted: a chairside safety check in seconds (who, allergies, medication, what's next), and reviewing history on demand to plan treatment.
Constraints: must look like Overview / Patient Records / Settings; must not feel busy or dense. Keep every piece of recorded data reachable. Leave room for the planned 3D dental chart (PRODUCT.md key feature). Exams and X-rays have no visit link in the database; they are placed by date.
Unresolved: where the 3D chart attaches (likely per timeline entry, per tooth findings); whether exams should be linked to appointments in the schema.

## Direction contract

THESIS: The record is the story of visits. One chronological spine where each day carries its visit, that day's exam and its X-rays, opened in place on demand. Refuses the default stack of separate same-weight panels (visits here, exams there, X-rays elsewhere) that makes staff join them up by date in their head.

OWN-WORLD: DESIGN.md staff world unchanged: white ground, flat 1px gray panels (8px corners, 20px padding, no shadow), Teal Green #00685F for the one main action, focus and the upcoming visit; Mint #F0FDFA for the pinned upcoming block; a single 1px gray timeline rule with small teal/gray nodes; status as worded pills; system sans; lucide icons.

STORY: Staff see the name and the red allergy line at once, glance at what's next, then scroll down the days; a day with an exam or X-rays offers "Show exam and X-rays" and opens in place, then closes again.

FIRST VIEWPORT: Page header as other staff pages (avatar, name, facts line, Book appointment right). Full-width Medical Status strip: allergy notice left, medication / conditions / smoking right. Below, left two-thirds: Visits panel with the upcoming visit pinned on mint at its top, then the timeline. Right third: Personal and Contact, Dental History (intake), Imaging Gallery (upload and all X-rays).

FORM: Visit Timeline; position 4 of 7 on my ordered list; seed key f45e8626. Signature interaction: a timeline day opens in place to reveal that day's exam details and X-ray thumbnails (opening the viewer), fading in over 200ms ease-smooth, instant under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
