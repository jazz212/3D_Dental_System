// Treatment Details Popup
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Treatment Details</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">

  // Pop up card
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

    // Section 1: Header — title + close button
    <div class="flex items-center justify-between px-7 py-6 border-b border-gray-100">
      <h2 class="text-2xl font-bold text-green-900">Treatment Details</h2>
      <button class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors">
        &#x2715;
      </button>
    </div>

    // Section 2: Treatment details — service, date, notes
    <div class="px-7 py-6 flex flex-col gap-3">

      // Service performed tile
      <div class="grid grid-cols-2 gap-3">

        // Service tile
        <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
          <p class="text-sm text-gray-500 mb-2">Service performed</p>
          // Service name + icon
          <span class="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">
            // Dental cleaning icon
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 3l-7 7m0 0l-4 9 9-4m-5-5l5 5"/>
            </svg>
            Dental cleaning
          </span>
        </div>

        // Date tile
        <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
          <p class="text-sm text-gray-500 mb-2">Date</p>
          <div class="flex items-center gap-2">
            // Calendar icon
            <svg class="w-4 h-4 text-green-800 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            <span class="text-sm font-bold text-gray-900">May 28, 2025</span>
          </div>
        </div>

      </div>

      // Notes tile
      <div class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
        <p class="text-sm text-gray-500 mb-1">Notes</p>
        <p class="text-sm text-gray-700 italic">"Routine prophylaxis"</p>
      </div>

    </div>

    // Section 3: Footer — Close button
    <div class="flex justify-end px-7 py-4 border-t border-gray-100">
      <button class="text-green-800 hover:text-green-900 text-sm font-semibold transition-colors">
        Close
      </button>
    </div>

  </div>

</body>
</html>
