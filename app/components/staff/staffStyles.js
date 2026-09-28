// Shared look for staff form fields and buttons, so pop-ups and pages match
// (see DESIGN.md: staff inputs and buttons).

// The border colour is chosen here instead of stacking "border-red-500" on
// top of "border-gray-300": with two border colours in one class list, which
// one wins depends on stylesheet order, not on which was written last.
export function fieldClass(hasError = false) {
  return `pointer-coarse:min-h-11 bg-[#F0FDFA] border ${
    hasError ? "border-red-500" : "border-gray-300"
  } rounded-lg px-3 py-2 w-full outline-none placeholder-gray-400 focus:border-[#00685F] disabled:opacity-50`;
}

export const labelClass = "text-sm font-medium";

// pointer-coarse: only on touch screens, buttons grow to 44px tall, the
// smallest size a finger hits reliably. Mouse users keep the compact look.
export const primaryButtonClass =
  "pointer-coarse:min-h-11 bg-[#00685F] px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-[#004d45] enabled:active:scale-[0.97] enabled:active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "pointer-coarse:min-h-11 bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-gray-50 enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:text-gray-400";

export const dangerButtonClass =
  "pointer-coarse:min-h-11 bg-red-600 px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-red-700 enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50";

// Tables (Dashboard appointments, Patient Records): light header, roomy cells.
export const tableHeaderCellClass =
  "px-4 py-3 text-left text-sm font-medium text-gray-500 bg-gray-50 border-b border-gray-200";
export const tableCellClass = "px-4 py-3";

// Small icon buttons in a table row (edit, view, archive...).
export const rowActionButtonClass =
  "inline-flex items-center justify-center pointer-coarse:min-h-11 pointer-coarse:min-w-11 p-1.5 rounded text-gray-500 cursor-pointer hover:text-[#00685F] hover:bg-[#F0FDFA] focus-visible:outline-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:opacity-50";

// Section panel that holds a heading, its controls and a table.
export const panelClass = "bg-white border border-gray-200 rounded-lg";
