"use client";

export default function DeleteAppointment({ onClose, onDelete }) {
  return (
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Section 1: Header — title + close button */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Delete appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Confirmation message */}
        <div className="px-7 py-8">
          <p className="text-base text-gray-500 leading-relaxed">
            Delete the appointment for{" "}
            <span className="font-bold text-gray-900">Maria Santos</span> on{" "}
            <span className="font-bold text-gray-900">Jun 16, 2025</span> at{" "}
            <span className="font-bold text-gray-900">9:00 AM</span>?{" "}
            This action cannot be undone.
          </p>
        </div>

        {/* Section 3: Footer — Cancel + Delete */}
        <div className="flex items-center justify-end gap-4 px-7 py-5">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 text-sm font-semibold hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
            {/* Trash icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
            Delete
          </button>
        </div>

      </div>
  );
}
