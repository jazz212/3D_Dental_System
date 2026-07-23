// UpdateTreatmentPopup.js
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Update Treatment</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  // Pop up card
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

    // Section 1: Header — title + close button
    <div class="flex items-center justify-between px-7 py-6">
      <h2 class="text-2xl font-bold text-gray-900">Update Treatment</h2>
      <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
        &#x2715;
      </button>
    </div>

    // Section 2: Form — service, date, notes
    <div class="px-7 pb-6 flex flex-col gap-5">

      // Service select input
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-500">Service</label>
        <select class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
          <option>Dental cleaning</option>
          <option>X-ray / Radiograph</option>
          <option>Tooth filling</option>
          <option>Tooth extraction</option>
          <option>Root canal treatment</option>
          <option>Crown placement</option>
          <option>Orthodontic adjustment</option>
          <option>Teeth whitening</option>
          <option>Consultation</option>
          <option>Fluoride treatment</option>
          <option>Dental implant</option>
        </select>
      </div>

      // Date input
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-500">Date</label>
        <input
          type="date"
          value="2025-05-28"
          class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>

      // Notes textarea
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-500">Notes</label>
        <textarea
          rows="3"
          class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-300">Routine prophylaxis</textarea>
      </div>

    </div>

    // Section 3: Footer — Cancel + Save changes buttons
    <div class="flex items-center justify-end gap-4 px-7 py-5 border-t border-gray-100">

      <button class="px-6 py-3 text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors">
        Cancel
      </button>

      <button class="flex items-center gap-2 px-7 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        Save changes
      </button>

    </div>

  </div>

</body>
</html>
