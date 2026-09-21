"use client";

export default function PendingRequests({
  requests,
  loading,
  error,
  actionError,
  decliningId,
  onSchedule,
  onDecline,
}) {
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

      {actionError && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">{actionError}</p>
      )}

      {error ? (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
      ) : loading ? (
        <p className="text-sm text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500">
          No pending requests. New bookings from the website show up here.
        </p>
      ) : (
        // Sorted most urgent first. max-h-96 (~5 rows) keeps the panel from
        // growing; staff scroll inside it for the rest.
        <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100 pr-1">
          {requests.map((request) => (
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

              <div className="flex shrink-0 gap-2 self-start sm:self-center">
                <button
                  onClick={() => onDecline(request)}
                  disabled={decliningId === request.id}
                  className="border border-gray-300 px-3 py-1.5 text-sm text-gray-600 rounded-lg cursor-pointer transition-all duration-100 hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:cursor-default disabled:opacity-50"
                >
                  {decliningId === request.id ? "Declining..." : "Decline"}
                </button>
                <button
                  onClick={() => onSchedule(request)}
                  className="bg-[#00685F] px-3 py-1.5 text-sm text-white rounded-lg cursor-pointer transition-all duration-100 active:scale-95 active:brightness-90"
                >
                  Schedule
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
