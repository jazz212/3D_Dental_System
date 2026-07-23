// EditAppointmentPopup.js
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Edit Appointment</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  // Pop up card
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

    // Header: title and close button
    <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
      <h2 class="text-2xl font-bold text-gray-900">
        Edit appointment —
        <span class="text-green-800">Maria Santos</span>
      </h2>
      <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
        &#x2715;
      </button>
    </div>

    // Section 2: Form — date, time, status, notes
    <div class="px-7 py-6 flex flex-col gap-5">

      // Date + Time — half width each
      <div class="grid grid-cols-2 gap-4">

        // Date input
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Date</label>
          <input
            type="date"
            value="2025-06-16"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>

        // Time dropdown
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Time</label>
          <select class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
            <option>8:00 AM</option>
            <option>8:30 AM</option>
            <option>9:00 AM</option>
            <option>9:30 AM</option>
            <option>10:00 AM</option>
            <option>10:30 AM</option>
            <option>11:00 AM</option>
            <option>1:00 PM</option>
            <option>1:30 PM</option>
            <option>2:00 PM</option>
            <option>2:30 PM</option>
            <option>3:00 PM</option>
            <option>3:30 PM</option>
            <option>4:00 PM</option>
          </select>
        </div>

      </div>

      // Status dropdown — half width
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Status</label>
        <select class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      // Notes textarea — full width
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Notes</label>
        <textarea
          rows="4"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-300">Routine visit</textarea>
      </div>

    </div>

    // Section 3: Footer — Save changes + Cancel
    <div class="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100">

      <button class="px-8 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
        Cancel
      </button>

      <button class="flex items-center gap-2 px-8 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        Save Changes
      </button>

    </div>

  </div>

</body>
</html>
