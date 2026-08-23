export default function NewAppointment({ onClose, onSave }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

      {/* CARD */}
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">

        {/* Section 1: Header — icon + title + close button */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Calendar icon */}
            <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h2 className="text-2xl font-bold text-green-900">New appointment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Form fields */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Patient name + Contact number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Patient name</label>
              <input type="text" placeholder="Full name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Contact number</label>
              <input type="text" placeholder="+63 9XX XXX XXXX" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Date</label>
              <input type="date" defaultValue="2025-06-16" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Time</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
                <option>8:00 AM</option><option>8:30 AM</option><option>9:00 AM</option><option>9:30 AM</option>
                <option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>1:00 PM</option>
                <option>1:30 PM</option><option>2:00 PM</option><option>2:30 PM</option><option>3:00 PM</option>
                <option>3:30 PM</option><option>4:00 PM</option>
              </select>
            </div>
          </div>

          {/* Service dropdown — half width */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Service</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
                <option>Dental cleaning</option><option>X-ray / Radiograph</option><option>Tooth filling</option>
                <option>Tooth extraction</option><option>Root canal treatment</option><option>Crown placement</option>
                <option>Orthodontic adjustment</option><option>Teeth whitening</option><option>Consultation</option>
                <option>Fluoride treatment</option><option>Dental implant</option>
              </select>
            </div>
          </div>

          {/* Notes textarea — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <textarea rows={4} placeholder="Optional notes or special instructions..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>

        </div>

        {/* Section 3: Footer — Save appointment + Clear */}
        <div className="flex items-center gap-3 px-7 py-5 border-t border-gray-100">
          <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save appointment
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Clear
          </button>
        </div>

      </div>
    </div>
  );
}
