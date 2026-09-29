"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// Padding for what goes inside a Dialog. A form puts both inside itself so
// the footer's submit button still belongs to the form.
export const dialogBodyClass = "flex flex-col gap-4 px-5 py-5";
// sticky: on a phone a long form scrolls under the footer, so Save and
// Cancel stay on screen instead of ending up below the fold.
export const dialogFooterClass =
  "sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4";

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

  // Escape closes the pop-up. Skipped when something inside already used the
  // key, e.g. Escape closing the patient picker's suggestion list.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // Phones: a sheet rising from the bottom edge, within thumb reach, that
    // grows to nearly full height for long forms. From sm: a centred box.
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        // The rounded box itself doesn't scroll: it clips to its corners and
        // the area under the title scrolls instead. Otherwise the scrollbar
        // runs up into the rounded corners and shows a square end there.
        className={`flex w-full flex-col ${wide ? "max-w-xl" : "max-w-lg"} max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-hidden rounded-t-xl sm:rounded-lg border border-gray-200 bg-white shadow-xl outline-none transition-opacity duration-150 ease-smooth starting:opacity-0 motion-reduce:transition-none`}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center pointer-coarse:min-h-11 pointer-coarse:min-w-11 rounded p-1.5 text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-[#00685F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* overscroll-contain: reaching the end of the form doesn't start
            scrolling the page behind the pop-up. */}
        <div className="min-h-0 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
