// AppointmentDetails.js
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment Details</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  //pop up card
  <div class="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl relative">

    //Header: title and close button
    <div class="flex items-start justify-between mb-6">
      <h2 class="text-2xl font-bold text-green-900">Appointment details</h2>
      <button class="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none">
        &#x2715;
      </button>
    </div>

    // Section 2: Patient info — avatar, name, phone, status
    <div class="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">

      // Avatar with initials
      <div class="w-14 h-14 rounded-full bg-green-100 text-green-800 text-base font-bold flex items-center justify-center flex-shrink-0">
        MS
      </div>

      // Patient name and phone
      <div class="flex-1 min-w-0">
        <p class="text-xl font-bold text-gray-900">Maria Santos</p>
        <p class="text-sm text-gray-500 mt-0.5">+63 917 000 0001</p>
      </div>

      // Status badge
      <div class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-green-50 text-green-800 border-green-200">
        <span class="w-2 h-2 rounded-full bg-current"></span>
        <span>Confirmed</span>
      </div>

    </div>

    // Section 3: Appointment details — date, time, service, dentist, notes
    <div class="grid grid-cols-2 gap-2.5 mb-2.5">

      <div class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Date</p>
        <p class="text-sm font-semibold text-gray-900">Jun 16, 2025</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Time</p>
        <p class="text-sm font-semibold text-gray-900">9:00 AM</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Service</p>
        <p class="text-sm font-semibold text-gray-900">Dental cleaning</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Dentist</p>
        <p class="text-sm font-semibold text-gray-900">Dr. Reyes</p>
      </div>

      // Notes — full width
      <div class="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Notes</p>
        <p class="text-sm font-semibold text-gray-900">Routine visit</p>
      </div>

    </div>

    // Section 4: Footer action
    <div class="flex justify-end mt-5">
      <button class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
        Close
      </button>
    </div>

  </div>

</body>
</html>
