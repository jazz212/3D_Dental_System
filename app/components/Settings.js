"use client";

import { useState } from "react";

/* ---------- Inline SVG icons (no external library needed) ---------- */
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <circle cx="8.5" cy="10.5" r="2" />
    <path d="M5.5 16.2c0-1.8 1.4-3 3-3s3 1.2 3 3" />
    <line x1="13.5" y1="9.2" x2="18.5" y2="9.2" />
    <line x1="13.5" y1="12" x2="18.5" y2="12" />
    <line x1="13.5" y1="14.8" x2="17" y2="14.8" />
  </svg>
);

const IconTooth = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-1 0-1.3-2.2-1.8-3.8-.2-.7-.5-1.2-1.2-1.2s-1 .5-1.2 1.2C7.3 18.8 7 21 6 21c-1.3 0-1.7-2.1-2.1-4.5C3.4 14 3 11.8 3 9.5 3 6.5 4.8 3 8 3c1.1 0 1.9.5 2.8.9.4.2.8.1 1.2-.1C13 3.4 13.8 3 14.9 3c3.3 0 5.1 3.5 5.1 6.5 0 2.3-.4 4.5-.9 7-.4 2.4-.8 4.5-2.1 4.5-1 0-1.3-2.2-1.8-3.8-.2-.7-.6-1.2-1.2-1.2s-1 .5-1.2 1.2C12.3 18.8 13 21 12 21Z" />
  </svg>
);

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);
const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

/* ---------- Shared input styling ---------- */
const inputBox =
  "w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const inputWrapper =
  "flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100";

export default function Settings() {
  const [generalInfo, setGeneralInfo] = useState({
    clinicName: "Tooth Peaked Dental Clinic",
    registrationNumber: "MED-774-8921",
    tagline: "Advanced Endodontics & General Care",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "contact@toothpeaked.com",
    phone: "+1 (555) 867-5309",
    address: "142 Medical District Blvd, Suite 300\nSeattle, WA 98104",
  });

  const [logo, setLogo] = useState({
    fileName: "logo_main_2023.svg",
    size: "45 KB",
    type: "SVG",
    previewUrl: null,
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateGeneral = (field, value) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateContact = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG or SVG file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB.");
      return;
    }

    setLogo({
      fileName: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type === "image/png" ? "PNG" : "SVG",
      previewUrl: URL.createObjectURL(file),
    });
    setIsDirty(true);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setIsDirty(true);
  };

  const handleSave = () => {
    console.log("Saving:", { generalInfo, contactInfo, logo });
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setIsDirty(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-8 pt-4 pb-8">
        {/* Page heading + Save/Discard */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Clinic Settings</h2>
            <p className="mt-1 text-slate-500">
              Manage your clinic profile, staff permissions, and system preferences.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              disabled={!isDirty}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Tab */}
       <div className="mb-8 flex items-center gap-2 border-b-2 border-teal-700 pb-3 text-lg font-semibold text-teal-700 w-fit">
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
    <IconTooth />
  </span>
  Clinic Profile
</div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* General Information */}
            <section className="rounded-xl border-l-4 border-l-teal-700 border-y border-r border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-teal-700">
                <IconInfo />
                <h3 className="text-lg font-bold text-slate-900">General Information</h3>
              </div>
              <p className="mb-5 text-sm text-slate-500">
                Public details displayed to patients on receipts and portals.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Clinic Name</label>
                  <input
                    type="text"
                    value={generalInfo.clinicName}
                    onChange={(e) => updateGeneral("clinicName", e.target.value)}
                    className={inputBox}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Registration Number</label>
                  <input
                    type="text"
                    value={generalInfo.registrationNumber}
                    onChange={(e) => updateGeneral("registrationNumber", e.target.value)}
                    className={inputBox}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tagline / Specialization</label>
                  <input
                    type="text"
                    value={generalInfo.tagline}
                    onChange={(e) => updateGeneral("tagline", e.target.value)}
                    className={inputBox}
                  />
                </div>
              </div>
            </section>

            {/* Contact & Location */}
            <section className="rounded-xl border-l-4 border-l-teal-700 border-y border-r border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 text-teal-700">
                <IconPin />
                <h3 className="text-lg font-bold text-slate-900">Contact &amp; Location</h3>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_220px]">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Primary Email</label>
                    <div className={inputWrapper}>
                      <span className="shrink-0 text-slate-400">
                        <IconMail />
                      </span>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => updateContact("email", e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
                    <div className={inputWrapper}>
                      <span className="shrink-0 text-slate-400">
                        <IconPhone />
                      </span>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Street Address</label>
                    <textarea
                      rows={2}
                      value={contactInfo.address}
                      onChange={(e) => updateContact("address", e.target.value)}
                      className={`${inputBox} resize-none`}
                    />
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-indigo-100 text-teal-700">
                  <IconPin />
                  <span className="mt-1 text-sm font-bold uppercase">Seattle</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Operating Hours */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-teal-700">
                <IconClock />
                <h3 className="text-lg font-bold text-slate-900">Operating Hours</h3>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                <HourRow day="Monday" hours="08:00 - 18:00" />
                <HourRow day="Tuesday" hours="08:00 - 18:00" />
                <HourRow day="Wednesday" hours="08:00 - 18:00" />
                <HourRow day="Thursday" hours="08:00 - 20:00" />
                <HourRow day="Friday" hours="08:00 - 16:00" />
                <HourRow day="Sat - Sun" closed />
              </div>
            </section>

            {/* Brand Assets */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-teal-700">
                <IconImage />
                <h3 className="text-lg font-bold text-slate-900">Brand Assets</h3>
              </div>

              <label
                htmlFor="logo-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-8 text-center text-slate-400 hover:border-teal-500 hover:text-teal-600"
              >
                <IconUpload />
                <span className="text-sm">
                  Drag &amp; drop or click to upload
                  <br />
                  (PNG, SVG max 2MB)
                </span>
                <input
                  id="logo-upload"
                  type="file"
                  accept=".png,.svg,image/png,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>

              {logo && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    {logo.previewUrl ? (
                      <img
                        src={logo.previewUrl}
                        alt="Logo preview"
                        className="h-9 w-9 rounded-md object-contain bg-slate-200"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-200 text-teal-700">
                        🦷
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-800">{logo.fileName}</p>
                      <p className="text-xs text-slate-500">
                        {logo.size} • {logo.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    aria-label="Remove logo"
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconTrash />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Operating Hours row ---------- */
function HourRow({ day, hours, closed }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="min-w-[92px] shrink-0 font-medium text-slate-700">{day}</span>
      <div className="flex-1 text-right">
        {closed ? (
          <span className="inline-block rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
            Closed
          </span>
        ) : (
          <span className="inline-block whitespace-nowrap rounded-md bg-slate-100 px-3 py-1 text-slate-700">
            {hours}
          </span>
        )}
      </div>
    </div>
  );
}