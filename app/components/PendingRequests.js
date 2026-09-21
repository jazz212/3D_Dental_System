"use client";
import { useState } from "react";

// The list comes sorted most urgent first, so the first few are the ones to act on.
const COLLAPSED_COUNT = 5;

export default function PendingRequests({ requests, loading, error, onSchedule }) {
  const [showAll, setShowAll] = useState(false);
  const visibleRequests = showAll ? requests : requests.slice(0, COLLAPSED_COUNT);
  const hasMore = requests.length > COLLAPSED_COUNT;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-lg">Pending Requests</h2>
        {!loading && requests.length > 0 && (
          <span className="rounded-full bg-[#00685F] px-2 py-0.5 text-xs font-semibold text-white">
            {requests.length}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
      ) : loading ? (
        <p className="text-sm text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500">
          No pending requests. New bookings from the website show up here.
        </p>
      ) : (
        <>
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1">
            {visibleRequests.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {request.patients.full_name}
                    {request.patients.age ? (
                      <span className="font-normal text-gray-500"> · {request.patients.age} yrs</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{request.patients.email}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {request.reason} · prefers {request.preferred_date}
                    {request.preferred_time_window ? `, ${request.preferred_time_window}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => onSchedule(request)}
                  className="shrink-0 self-start sm:self-center bg-[#00685F] px-3 py-1.5 text-sm text-white rounded-lg cursor-pointer transition-all duration-100 active:scale-95 active:brightness-90"
                >
                  Schedule
                </button>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setShowAll((previous) => !previous)}
              className="mt-3 text-sm font-semibold text-[#00685F] cursor-pointer hover:underline"
            >
              {showAll ? "Show less" : `View all (${requests.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
