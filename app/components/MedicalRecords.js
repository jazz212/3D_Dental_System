"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Inline SVG icons (no external library needed) ---------- */
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconCube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconPersonAdd = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevron = ({ dir = "left" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

const DEFAULT_TREATMENTS = [];
const DEFAULT_IMAGES = [];

// Fixed, meaningful filter categories — independent of whatever
// per-photo labels (PANORAMIC, PERIAPICAL, etc.) exist in the data.
const TABS = [
  { key: "all", label: "All Images" },
  { key: "xrays", label: "X-Rays" },
  { key: "3d", label: "3D Scans" },
];

export default function PatientRecord({
  patient,
  images = DEFAULT_IMAGES,
  treatments: initialTreatments = DEFAULT_TREATMENTS,
}) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [gallery, setGallery] = useState(images);
  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Re-sync local state whenever a different patient's data comes in,
  // so switching patients doesn't leave stale treatments/images on screen.
  useEffect(() => {
    setTreatments(initialTreatments);
    setGallery(images);
    setActiveTab("all");
    setShowAll(false);
  }, [patient?.patientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(
    () => (activeTab === "all" ? gallery : gallery.filter((img) => img.category === activeTab)),
    [gallery, activeTab]
  );

  const VISIBLE_LIMIT = 6;
  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_LIMIT);
  const hiddenCount = filtered.length - visible.length;

  function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const additions = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      category: "xrays", // default category for freshly uploaded images
      label: "PANORAMIC",
      title: file.name.replace(/\.[^/.]+$/, ""),
      meta: `Uploaded · ${time}`,
      src: URL.createObjectURL(file),
    }));
    setGallery((prev) => [...additions, ...prev]);
    setShowAll(true);
    e.target.value = "";
  }

  function deleteTreatment(idx) {
    setTreatments((prev) => prev.filter((_, i) => i !== idx));
  }

  function openLightbox(idx) {
    setLightboxIndex(idx);
  }
  function closeLightbox() {
    setLightboxIndex(null);
  }
  function stepLightbox(delta) {
    setLightboxIndex((i) => {
      if (i === null) return i;
      const n = visible.length;
      return (i + delta + n) % n;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-8 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Patient header card */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
                  {patient.avatarInitials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">ID: #{patient.patientId}</p>
                  <span className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-teal-700">
                    {patient.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">DOB</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {patient.dob} ({patient.age})
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Blood Type</p>
                  <p className="mt-1 font-semibold text-slate-800">{patient.bloodType}</p>
                </div>
              </div>
            </section>

            {/* Medical Status card */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-teal-700">
                <IconShield />
                <h3 className="text-lg font-bold text-slate-900">Medical Status</h3>
              </div>

              <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 p-4">
                <span className="mt-0.5 text-red-500">
                  <IconAlert />
                </span>
                <div>
                  <p className="text-sm font-semibold text-red-700">Allergies</p>
                  <p className="text-sm text-red-600">{patient.allergies}</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-sm">
                <InfoRow label="Last Visit" value={patient.lastVisit} />
                <InfoRow label="Next Appt" value={patient.nextAppt} highlight />
                <InfoRow label="Primary Dr." value={patient.primaryDoctor} />
              </div>
            </section>

            {/* Treatment History */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-700">
                  <IconHistory />
                  <h3 className="text-lg font-bold text-slate-900">Treatment History</h3>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">
                  <IconPersonAdd />
                  Add Treatment
                </button>
              </div>

              <div className="space-y-3">
                {treatments.length === 0 && (
                  <p className="text-sm text-slate-400">No treatments logged yet.</p>
                )}
                {treatments.map((t, i) => (
                  <TreatmentCard key={i} treatment={t} onDelete={() => deleteTreatment(i)} />
                ))}
              </div>
            </section>
          </div>

          {/* Right column — Imaging Gallery */}
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-lg font-bold text-slate-900">Imaging Gallery</h3>
              <p className="mb-4 text-sm text-slate-500">
                {gallery.length} record{gallery.length === 1 ? "" : "s"} found for #{patient.patientId}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <IconFilter />
                  Filter
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
                >
                  <IconUpload />
                  Upload
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <IconCube />
                  3D Jaw Mockup
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>

              {/* Fixed category tabs — All Images / X-Rays / 3D Scans */}
              <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setShowAll(false);
                    }}
                    className={`px-3 pb-2 text-sm font-medium ${
                      activeTab === tab.key
                        ? "border-b-2 border-teal-700 text-teal-700"
                        : "text-slate-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                  No images in this category yet.
                </div>
              ) : (
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
                >
                  {visible.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => openLightbox(idx)}
                      className="overflow-hidden rounded-lg border border-slate-200 text-left"
                    >
                      <div className="relative flex h-24 items-center justify-center bg-slate-700">
                        {/* Badge shows the specific shot type (label), unrelated to the tab filter */}
                        <span className="absolute top-2 right-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                          {img.label}
                        </span>
                        {img.src ? (
                          <img src={img.src} alt={img.title} className="h-full w-full object-cover" />
                        ) : (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="truncate text-xs font-semibold text-slate-800">{img.title}</p>
                        <p className="truncate text-[10px] text-slate-400">{img.meta}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {hiddenCount > 0 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Show {hiddenCount} more
                </button>
              )}
              {showAll && filtered.length > VISIBLE_LIMIT && (
                <button
                  onClick={() => setShowAll(false)}
                  className="mt-2 w-full rounded-lg py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  Collapse
                </button>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && visible[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={closeLightbox}
        >
          <button
            aria-label="Close"
            onClick={closeLightbox}
            className="absolute top-5 right-5 rounded-full p-2 text-white/80 hover:text-white"
          >
            <IconClose />
          </button>

          {visible.length > 1 && (
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(-1);
              }}
              className="absolute left-4 rounded-full p-2 text-white/80 hover:text-white sm:left-8"
            >
              <IconChevron dir="left" />
            </button>
          )}

          <div
            className="w-full max-w-xl overflow-hidden rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-72 items-center justify-center bg-slate-700">
              {visible[lightboxIndex].src ? (
                <img
                  src={visible[lightboxIndex].src}
                  alt={visible[lightboxIndex].title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-800">{visible[lightboxIndex].title}</p>
              <p className="text-xs text-slate-400">{visible[lightboxIndex].meta}</p>
            </div>
          </div>

          {visible.length > 1 && (
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(1);
              }}
              className="absolute right-4 rounded-full p-2 text-white/80 hover:text-white sm:right-8"
            >
              <IconChevron dir="right" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${highlight ? "text-teal-700" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}

function TreatmentCard({ treatment, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
      <div>
        <p className="text-xs font-semibold text-slate-400">{treatment.date}</p>
        <p className="mt-0.5 font-semibold text-slate-800">{treatment.service}</p>
        <p className="text-sm text-slate-500">{treatment.notes}</p>
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        <button aria-label="Edit" className="hover:text-teal-700">
          <IconEdit />
        </button>
        <button aria-label="View" className="hover:text-teal-700">
          <IconEye />
        </button>
        <button aria-label="Delete" onClick={onDelete} className="hover:text-red-600">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}