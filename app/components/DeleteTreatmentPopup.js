// DeleteTreatmentPopup.js
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delete Treatment Entry</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  // Pop up card
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

    // Section 1: Header — close button top-right, title below
    <div class="relative px-7 pt-6 pb-4">
      <button class="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
        &#x2715;
      </button>
      <h2 class="text-2xl font-bold text-gray-900 pr-8">Delete treatment entry</h2>
    </div>

    // Section 2: Confirmation message
    <div class="px-7 py-4">
      <p class="text-base text-gray-500 leading-relaxed">
        Are you sure you want to delete the
        <span class="font-bold text-gray-900">Dental cleaning</span>
        entry dated
        <span class="font-bold text-gray-900">May 28, 2025</span>?
        This action cannot be undone.
      </p>
    </div>

    // Section 3: Footer — Cancel + Delete entry
    <div class="flex items-center justify-end gap-4 px-7 py-6">

      <button class="px-6 py-3 text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors">
        Cancel
      </button>

      <button class="flex items-center gap-2 px-7 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
        // Trash icon
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
        Delete entry
      </button>

    </div>

  </div>

</body>
</html>
