"use client";

export default function AddTreatment({ onClose, onSave }) {
  return (
 
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Section 1: Header — title + close button */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-green-900">Add Treatment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Form fields */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Service dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Service</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
              <option value="" disabled>Select a clinical service...</option>
              <option className="text-gray-900">Dental cleaning</option>
              <option className="text-gray-900">X-ray / Radiograph</option>
              <option className="text-gray-900">Tooth filling</option>
              <option className="text-gray-900">Tooth extraction</option>
              <option className="text-gray-900">Root canal treatment</option>
              <option className="text-gray-900">Crown placement</option>
              <option className="text-gray-900">Orthodontic adjustment</option>
              <option className="text-gray-900">Teeth whitening</option>
              <option className="text-gray-900">Consultation</option>
              <option className="text-gray-900">Fluoride treatment</option>
              <option className="text-gray-900">Dental implant</option>
            </select>
          </div>

          {/* Date input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>

          {/* Notes textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Detailed clinical observations, procedure notes, or follow-up instructions..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>

        </div>

        {/* Section 3: Footer — Cancel + Save entry */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onSave} className="px-8 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
            Save entry
          </button>
        </div>

      </div>
  );
}
