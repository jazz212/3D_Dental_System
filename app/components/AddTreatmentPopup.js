// AddTreatmentPopup.js
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Add Treatment</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  // Modal container
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

    // Section 1: Header — title + close button
    <div class="flex items-center justify-between px-7 py-6 border-b border-gray-100">
      <h2 class="text-2xl font-bold text-green-900">Add Treatment</h2>
      <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
        &#x2715;
      </button>
    </div>

    // Section 2: Form fields
    <div class="px-7 py-6 flex flex-col gap-5">

      // Service dropdown
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">Service</label>
        <select class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="" disabled selected>Select a clinical service...</option>
          <option class="text-gray-900">Dental cleaning</option>
          <option class="text-gray-900">X-ray / Radiograph</option>
          <option class="text-gray-900">Tooth filling</option>
          <option class="text-gray-900">Tooth extraction</option>
          <option class="text-gray-900">Root canal treatment</option>
          <option class="text-gray-900">Crown placement</option>
          <option class="text-gray-900">Orthodontic adjustment</option>
          <option class="text-gray-900">Teeth whitening</option>
          <option class="text-gray-900">Consultation</option>
          <option class="text-gray-900">Fluoride treatment</option>
          <option class="text-gray-900">Dental implant</option>
        </select>
      </div>

      // Date input
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">Date</label>
        <input
          type="date"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>

      // Notes textarea
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">Notes <span class="font-normal text-gray-400">(optional)</span></label>
        <textarea
          rows="4"
          placeholder="Detailed clinical observations, procedure notes, or follow-up instructions..."
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"></textarea>
      </div>

    </div>

    // Section 3: Footer — Cancel + Save entry
    <div class="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100">

      <button class="px-8 py-3 bg-white border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
        Cancel
      </button>

      <button class="px-8 py-3 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
        Save entry
      </button>

    </div>

  </div>

</body>
</html>
