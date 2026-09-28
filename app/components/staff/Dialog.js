"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// Padding for what goes inside a Dialog. A form puts both inside itself so
// the footer's submit button still belongs to the form.
export const dialogBodyClass = "flex flex-col gap-4 px-5 py-5";
export const dialogFooterClass =
  "flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 px-5 py-4";

// The one frame every staff pop-up uses: dim backdrop, flat white box,
// title and close button. Each pop-up only supplies its content.
export default function Dialog({ title, onClose, wide = false, children }) {
  const titleId = useId();
  const panelRef = useRef(null);

  // Put keyboard focus inside the pop-up when it opens, so Tab starts
  // from here instead of from the page behind it.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`w-full ${wide ? "max-w-xl" : "max-w-lg"} max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl outline-none transition-opacity duration-150 ease-smooth starting:opacity-0 motion-reduce:transition-none`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-[#00685F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
