"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageButtonClass =
  "flex min-w-8 h-8 items-center justify-center rounded-lg border border-gray-300 px-2 text-sm tabular-nums cursor-pointer enabled:hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:text-gray-300";

// "Showing 11-20 of 34 patients" plus page buttons, shared by the
// Dashboard and Patient Records tables. itemLabel names what is counted.
export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  itemLabel,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstShown = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastShown = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
      <p className="text-sm text-gray-500 tabular-nums">
        Showing {firstShown}–{lastShown} of {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={pageButtonClass}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageWindow(currentPage, totalPages).map((pageNumber, index) => {
          if (pageNumber === "gap") {
            return (
              <span key={`gap-${index}`} className="px-1 text-gray-400">
                …
              </span>
            );
          }
          const isCurrent = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isCurrent ? "page" : undefined}
              className={`${pageButtonClass} ${
                isCurrent ? "border-[#00685F] bg-[#00685F] text-white" : ""
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={pageButtonClass}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Page buttons to show: always the first and last page plus the current
// page and its neighbours, with "gap" where pages are skipped.
// e.g. page 6 of 20 -> 1 … 5 6 7 … 20
function getPageWindow(currentPage, totalPages) {
  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
      pages.push(page);
    }
  }
  const items = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous && page - previous === 2) {
      // A gap of one page: show that page instead of "…".
      items.push(previous + 1);
    } else if (previous && page - previous > 2) {
      items.push("gap");
    }
    items.push(page);
  });
  return items;
}
