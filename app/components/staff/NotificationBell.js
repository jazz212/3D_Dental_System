"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarClock, CalendarPlus, CalendarX, Hourglass } from "lucide-react";
import { fetchNotificationBooking, useNotifications } from "@/lib/notifications";
import { formatStoredAge } from "@/lib/age";

const TYPE_ICONS = {
  new_booking: CalendarPlus,
  cancelled: CalendarX,
  pending_reminder: Hourglass,
  visits_tomorrow: CalendarClock,
};

// Where each type leads on the dashboard. "cancelled" opens the booking
// itself instead (see openNotification).
const TYPE_SECTIONS = {
  new_booking: "pending-requests",
  pending_reminder: "pending-requests",
  visits_tomorrow: "upcoming-visits",
};

// "just now", "2 min ago", "3 hr ago", "2 days ago", then the date.
function formatRelativeTime(timestamp, now) {
  const minutes = Math.floor((now - new Date(timestamp).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// open / onOpenChange come from the Navbar, so only one header panel is
// open at a time.
export default function NotificationBell({ open, onOpenChange, onOpenAppointment }) {
  const router = useRouter();
  const pathname = usePathname();
  const { notifications, unreadCount, loading, error, markRead, markAllRead } = useNotifications();
  // Re-rendered every minute while open so "2 min ago" keeps counting.
  const [now, setNow] = useState(() => Date.now());
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setNow(Date.now()), 60000);

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) onOpenChange(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onOpenChange(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  const toggleOpen = () => {
    setNow(Date.now());
    onOpenChange(!open);
  };

  const goToDashboardSection = (sectionId) => {
    if (pathname === "/dashboard") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/dashboard#${sectionId}`);
    }
  };

  const openNotification = async (notification) => {
    onOpenChange(false);
    if (!notification.is_read) markRead(notification.id);

    if (notification.booking_id) {
      try {
        const booking = await fetchNotificationBooking(notification.booking_id);
        if (booking) onOpenAppointment(booking);
      } catch {
        // Already logged in lib; the notification is still marked read.
      }
      return;
    }
    const sectionId = TYPE_SECTIONS[notification.type];
    if (sectionId) goToDashboardSection(sectionId);
  };

  const badge = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative w-10 h-10 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-red-600 text-white text-[0.6875rem] font-semibold leading-[1.125rem] text-center tabular-nums"
          >
            {badge}
          </span>
        )}
      </button>

      {open && (
        // Phones: spans the screen under the top bar. From sm: a dropdown
        // under the bell, like the search results.
        <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:w-96 mt-2 z-40 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-sm font-medium text-[#00685F] hover:underline underline-offset-4 pointer-coarse:min-h-11"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[70dvh] sm:max-h-[28rem] overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Loading notifications...</p>
            ) : error && notifications.length === 0 ? (
              <p className="p-4 text-sm text-red-600">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">You&apos;re all caught up.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const Icon = TYPE_ICONS[notification.type] || Bell;
                  const age =
                    notification.appointment &&
                    formatStoredAge(
                      notification.appointment.requester_date_of_birth,
                      notification.appointment.requester_age,
                    );
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => openNotification(notification)}
                        className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-[#F0FDFA] cursor-pointer ${
                          notification.is_read ? "" : "bg-[#F0FDFA]/60"
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                            notification.type === "cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-[#F0FDFA] text-[#00685F]"
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm ${
                              notification.is_read ? "text-gray-700" : "font-semibold text-gray-900"
                            }`}
                          >
                            {notification.message}
                          </span>
                          <span className="block text-xs text-gray-500">
                            {age ? `${age} · ` : ""}
                            {formatRelativeTime(notification.created_at, now)}
                          </span>
                        </span>
                        {!notification.is_read && (
                          <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#00685F]">
                            <span className="sr-only">Unread</span>
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
