"use client";

export default function TreatmentDetails({ onClose }) {
  return (

      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Section 1: Header — title + close button */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-green-900">Treatment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Detail tiles */}
        <div className="px-7 py-6 flex flex-col gap-3">

          {/* Service + Date side by side */}
          <div className="grid grid-cols-2 gap-3">

            {/* Service performed tile */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
              <p className="text-sm text-gray-500 mb-2">Service performed</p>
              {/* Green pill badge */}
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">
                {/* Broom/cleaning icon */}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3l-7 7m0 0l-4 9 9-4m-5-5l5 5" />
                </svg>
                Dental cleaning
              </span>
            </div>

            {/* Date tile */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
              <p className="text-sm text-gray-500 mb-2">Date</p>
              <div className="flex items-center gap-2">
                {/* Calendar icon */}
                <svg className="w-4 h-4 text-green-800 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-sm font-bold text-gray-900">May 28, 2025</span>
              </div>
            </div>

          </div>

          {/* Notes tile — full width */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700 italic">"Routine prophylaxis"</p>
          </div>

        </div>

        {/* Section 3: Footer — Close button right-aligned */}
        <div className="flex justify-end px-7 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-green-800 hover:text-green-900 text-sm font-semibold transition-colors">
            Close
          </button>
        </div>

      </div>
  );
}
