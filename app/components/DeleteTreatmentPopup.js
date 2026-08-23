export default function DeleteTreatment({ onClose, onDelete }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

      {/* CARD */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Section 1: Header — close button top-right, title below */}
        <div className="relative px-7 pt-6 pb-4">
          <button onClick={onClose} className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
          <h2 className="text-2xl font-bold text-gray-900 pr-8">Delete treatment</h2>
        </div>

        {/* Section 2: Confirmation message */}
        <div className="px-7 py-4">
          <p className="text-base text-gray-500 leading-relaxed">
            Are you sure you want to delete the{" "}
            <span className="font-bold text-gray-900">Dental cleaning</span> entry dated{" "}
            <span className="font-bold text-gray-900">May 28, 2025</span>?{" "}
            This action cannot be undone.
          </p>
        </div>

        {/* Section 3: Footer — Cancel + Delete entry */}
        <div className="flex items-center justify-end gap-4 px-7 py-6">
          <button onClick={onClose} className="px-6 py-3 text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 px-7 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
            {/* Trash icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
            Delete entry
          </button>
        </div>

      </div>
    </div>
  );
}
