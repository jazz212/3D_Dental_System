// Helper function — converts "9:00 AM" style string to total minutes from midnight
function toMinutes(time) {
  const [hourMin, period] = time.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Calculates the human-readable duration between two time strings
function getDuration(start, end) {
  const diff = toMinutes(end) - toMinutes(start);
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

export default function AppointmentDetails({ onClose }) {

  // These would come from props or your data source in a real implementation
  const startTime = "9:00 AM";
  const endTime = "10:30 AM";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

      {/* CARD */}
      <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl relative">

        {/* Section 1: Header — title + close button */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-900">Appointment details</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">
            &#x2715;
          </button>
        </div>

        {/* Section 2: Patient identity — avatar, name, phone, status badge */}
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">

          {/* Initials avatar */}
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-800 text-base font-bold flex items-center justify-center flex-shrink-0">
            MS
          </div>

          {/* Name and phone */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-gray-900">Maria Santos</p>
            <p className="text-sm text-gray-500 mt-0.5">+63 917 000 0001</p>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-green-50 text-green-800 border-green-200">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Confirmed</span>
          </div>

        </div>

        {/* Section 3: Detail tiles */}
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">

          {/* Date */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Date</p>
            <p className="text-sm font-semibold text-gray-900">Jun 16, 2025</p>
          </div>

          {/* Duration — auto-calculated from startTime and endTime above */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{getDuration(startTime, endTime)}</p>
          </div>

          {/* Start time */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Start time</p>
            <p className="text-sm font-semibold text-gray-900">{startTime}</p>
          </div>

          {/* End time */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widests text-gray-400 uppercase mb-1">End time</p>
            <p className="text-sm font-semibold text-gray-900">{endTime}</p>
          </div>

          {/* Service */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Service</p>
            <p className="text-sm font-semibold text-gray-900">Dental cleaning</p>
          </div>

          {/* Dentist */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Dentist</p>
            <p className="text-sm font-semibold text-gray-900">Dr. Reyes</p>
          </div>

          {/* Notes — full width */}
          <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-sm font-semibold text-gray-900">Routine visit</p>
          </div>

        </div>

        {/* Section 4: Footer action */}
        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
