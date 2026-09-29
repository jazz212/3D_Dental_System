"use client";
import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import {
  fieldClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/app/components/staff/staffStyles";

const CLINIC_NAME = "ToothPeak Dental Clinic";

const INK_COLOR = "#1F2937";

// Today as YYYY-MM-DD in local time, which is what <input type="date"> wants.
const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// patientSignature is the drawn signature as a PNG data URL ("" = unsigned).
const emptyConsent = () => ({
  patientName: "",
  patientSignature: "",
  patientDate: todayISO(),
  witnessName: "",
  examinedBy: "",
  examinedDate: todayISO(),
});

/* ---------- Drawing surface: stylus, finger or mouse ---------- */
function SignaturePad({ id, value, onChange, printedName, hasError, describedBy }) {
  const canvasRef = useRef(null);
  const activePointer = useRef(null);
  const lastPoint = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  // The image currently on the canvas. Lets a value coming back in from the
  // parent skip a repaint over the strokes that made it, and lets a resize
  // repaint without reading props from a stale closure.
  const exported = useRef(value);

  // Clears the canvas and, if there is a saved signature, draws it back in.
  const repaint = (dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);
    if (!dataUrl) return;
    const img = new Image();
    img.onload = () => {
      // Scaled to fit, so a signature drawn on a wider screen still shows whole.
      const scale = Math.min(width / img.width, height / img.height);
      ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    };
    img.src = dataUrl;
  };

  // Match the canvas pixels to its on-screen size (and the screen's pixel
  // density) so strokes stay sharp. Resizing wipes a canvas, so repaint after.
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === sizeRef.current.width && rect.height === sizeRef.current.height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width: rect.width, height: rect.height };
      repaint(exported.current);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // A new value from outside (Clear, Discard changes) replaces what is drawn.
  useEffect(() => {
    if (value === exported.current) return;
    exported.current = value;
    repaint(value);
  }, [value]);

  const pointFrom = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Pens report pressure, so a stylus gets thicker lines when pressed harder.
  // Mice and most fingers report a flat 0.5, which lands on a steady 2.5px.
  const lineWidthFor = (e) => (e.pointerType === "pen" ? 1 + e.pressure * 3 : 2.5);

  const strokeTo = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const p = pointFrom(e);
    ctx.strokeStyle = INK_COLOR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidthFor(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
  };

  const handlePointerDown = (e) => {
    // One stroke at a time: a resting palm or second finger is ignored.
    if (activePointer.current !== null) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    activePointer.current = e.pointerId;
    lastPoint.current = pointFrom(e);
    // A tap with no movement still leaves a dot.
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = INK_COLOR;
    ctx.beginPath();
    ctx.arc(lastPoint.current.x, lastPoint.current.y, lineWidthFor(e) / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e) => {
    if (e.pointerId !== activePointer.current) return;
    // Coalesced events are the in-between samples the browser batched up;
    // using them keeps fast stylus strokes smooth instead of jagged.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    (events.length ? events : [e]).forEach(strokeTo);
  };

  const handlePointerEnd = (e) => {
    if (e.pointerId !== activePointer.current) return;
    activePointer.current = null;
    lastPoint.current = null;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    exported.current = dataUrl;
    onChange(dataUrl);
  };

  return (
    <div
      className={`relative h-44 rounded-lg border bg-[#F0FDFA] ${
        hasError ? "border-red-500" : "border-gray-300"
      }`}
    >
      {!value && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-gray-400 select-none"
        >
          Sign here
        </span>
      )}
      {/* Signature over printed name: the signing line with the name under it,
          as on the paper form. Drawn in the page, not into the saved image. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-4 select-none">
        <div className="border-b border-gray-400" />
        <p className={`mt-1 truncate text-center text-sm ${printedName ? "font-medium text-gray-800" : "text-gray-400"}`}>
          {printedName || "Printed name"}
        </p>
      </div>
      {/* touch-none stops a finger or stylus from scrolling the page while signing */}
      <canvas
        id={id}
        ref={canvasRef}
        role="img"
        aria-label={`Patient's signature drawing area. ${value ? "Signed." : "Not signed yet."}`}
        aria-describedby={describedBy}
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-lg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
    </div>
  );
}

/* ---------- Labelled text or date field with its error line ---------- */
function Field({ id, label, error, className = "", ...inputProps }) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        className={`${fieldClass(Boolean(error))} mt-1`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function PatientConsent({ value, onChange, onSave, onDiscard }) {
  const [internal, setInternal] = useState(emptyConsent);
  const [errors, setErrors] = useState({});

  const data = value ?? internal;
  const update = (next) => (onChange ? onChange(next) : setInternal(next));
  const setField = (key, val) => update({ ...data, [key]: val });

  const handleSave = () => {
    const nextErrors = {};
    if (!data.patientName.trim()) nextErrors.patientName = "Enter the patient's full name.";
    if (!data.patientSignature) nextErrors.patientSignature = "The patient needs to sign.";
    if (!data.patientDate) nextErrors.patientDate = "Enter the date the patient signed.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave?.(data);
  };

  const handleDiscard = () => {
    setErrors({});
    if (onDiscard) onDiscard();
    else setInternal(emptyConsent());
  };

  const nameShown = data.patientName.trim();

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Patient Consent</h1>
        <p className="text-gray-500">
          Have the patient read the statement below and sign it.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <section className={`${panelClass} p-5`}>
          <h2 className="font-bold text-lg">Consent statement</h2>

          <Field
            id="consent-patient-name"
            label="Patient's full name"
            className="mt-4 max-w-md"
            type="text"
            value={data.patientName}
            placeholder="Juan Dela Cruz"
            maxLength={120}
            error={errors.patientName}
            onChange={(e) => setField("patientName", e.target.value)}
          />

          {/* The paper form's wording, split at its natural breaks and
              justified like the printed page. */}
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-5 leading-relaxed text-gray-800 sm:text-justify">
            <p>
              I,{" "}
              <span className="inline-block min-w-48 border-b border-gray-400 px-1 text-center font-semibold">
                {nameShown || " "}
              </span>
              , certify that the information that I have stated is true and
              correct to the best of my knowledge.
            </p>
            <p>
              I also consent to any dental procedure that will be rendered to me
              by any dentist of {CLINIC_NAME}. I understand the procedures,
              including the risks as the dentists explained to me. I also
              understand that no warranty or guarantee of success can be given
              and therefore, my attending dentist will not be liable to whatever
              may happen to me before, during and after any dental procedure that
              I will undertake.
            </p>
            <p>
              Furthermore, I hereby consent {CLINIC_NAME} to use my data for
              referrals to specialists. Also, I hereby allow/authorize{" "}
              {CLINIC_NAME} to use, collect and process information for
              legitimate purposes, specifically for consultation and allow
              authorized personnel to process the information, store and save in
              sufficiently secured and protected database, and even destroy the
              same in accordance with the law, rules and regulations.
            </p>
          </div>
        </section>

        <section className={`${panelClass} p-5`}>
          <h2 className="font-bold text-lg">Signature</h2>

          <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="consent-patient-signature" className={labelClass}>
                  Patient&apos;s signature over printed name
                </label>
                <button
                  type="button"
                  onClick={() => setField("patientSignature", "")}
                  disabled={!data.patientSignature}
                  className={`${secondaryButtonClass} flex items-center gap-2 text-sm`}
                >
                  <Eraser aria-hidden="true" className="w-4 h-4" />
                  Clear
                </button>
              </div>
              <div className="mt-2">
                <SignaturePad
                  id="consent-patient-signature"
                  value={data.patientSignature}
                  printedName={nameShown}
                  hasError={Boolean(errors.patientSignature)}
                  describedBy={errors.patientSignature ? "consent-patient-signature-error" : undefined}
                  onChange={(sig) => setField("patientSignature", sig)}
                />
              </div>
              {errors.patientSignature && (
                <p id="consent-patient-signature-error" className="mt-1 text-sm text-red-600">
                  {errors.patientSignature}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 lg:pt-9">
              <Field
                id="consent-patient-date"
                label="Date"
                type="date"
                value={data.patientDate}
                error={errors.patientDate}
                onChange={(e) => setField("patientDate", e.target.value)}
              />
              <Field
                id="consent-witness"
                label="Witness"
                type="text"
                value={data.witnessName}
                placeholder="Full name"
                maxLength={120}
                onChange={(e) => setField("witnessName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6 border-t border-gray-200 pt-6 sm:grid-cols-2 lg:gap-6">
            <Field
              id="consent-examined-by"
              label="Examined by"
              type="text"
              value={data.examinedBy}
              placeholder="Dentist's full name"
              maxLength={120}
              onChange={(e) => setField("examinedBy", e.target.value)}
            />
            <Field
              id="consent-examined-date"
              label="Date"
              type="date"
              value={data.examinedDate}
              onChange={(e) => setField("examinedDate", e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 sm:gap-4">
            <button type="button" onClick={handleDiscard} className={secondaryButtonClass}>
              Discard changes
            </button>
            <button type="button" onClick={handleSave} className={primaryButtonClass}>
              Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
