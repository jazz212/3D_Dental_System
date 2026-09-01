export default function EditAppointment({ onClose, onSave }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

      {/* CARD */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Section 1: Header — title + patient name + close button */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit appointment — <span className="text-green-800">Maria Santos</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Form fields */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Date — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Date</label>
            <input
              type="date"
              defaultValue="2025-06-16"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>

          {/* Start time + End time side by side */}
          <div className="grid grid-cols-2 gap-4">

            {/* Start time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Start time</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
                <option>8:00 AM</option><option>8:30 AM</option><option selected>9:00 AM</option><option>9:30 AM</option>
                <option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>1:00 PM</option>
                <option>1:30 PM</option><option>2:00 PM</option><option>2:30 PM</option><option>3:00 PM</option>
                <option>3:30 PM</option><option>4:00 PM</option>
              </select>
            </div>

            {/* End time — editable so dentist can update when treatment ends earlier or later */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">End time</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
                <option>8:30 AM</option><option>9:00 AM</option><option>9:30 AM</option>
                <option>10:00 AM</option><option selected>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option>
                <option>12:00 PM</option><option>1:00 PM</option><option>1:30 PM</option><option>2:00 PM</option>
                <option>2:30 PM</option><option>3:00 PM</option><option>3:30 PM</option><option>4:00 PM</option><option>4:30 PM</option><option>5:00 PM</option>
              </select>
            </div>

          </div>

          {/* Status dropdown — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Status</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
              <option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option>
            </select>
          </div>

          {/* Notes textarea — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widests text-gray-400 uppercase">Notes</label>
            <textarea
              rows={4}
              defaultValue="Routine visit"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>

        </div>

        {/* Section 3: Footer — Cancel + Save Changes */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onSave} className="flex items-center gap-2 px-8 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
