import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { describeError } from "@/lib/errorLogging";
import { getLocalDateString } from "@/lib/appointmentTimes";

// Enough for the dropdown; the badge caps at "9+" anyway.
const NOTIFICATION_LIMIT = 30;

// Rows are written by database triggers (see the notifications migration),
// never from here, so bookings from any source are covered.
async function fetchNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id, type, message, appointment_id, booking_id, target_date, is_read, created_at, appointment:appointments(requester_date_of_birth, requester_age)",
    )
    .order("created_at", { ascending: false })
    .limit(NOTIFICATION_LIMIT);

  if (error) {
    console.error(
      "Could not load notifications. Check the notifications migration has been run:",
      describeError(error),
    );
    throw error;
  }
  return data;
}

// Creates today's time-based notifications (requests waiting over a day,
// visits tomorrow). Safe to call repeatedly: the database adds each one
// once per day. Sends the browser's date because the database runs in UTC.
async function refreshScheduledNotifications() {
  const { error } = await supabase.rpc("refresh_notifications", {
    p_today: getLocalDateString(new Date()),
  });
  if (error) {
    // Not fatal: the event notifications still load.
    console.error("Could not create today's reminder notifications:", describeError(error));
  }
}

async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
  if (error) {
    console.error(`Could not mark notification ${notificationId} read:`, describeError(error));
    throw error;
  }
}

async function markAllNotificationsRead() {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
  if (error) {
    console.error("Could not mark all notifications read:", describeError(error));
    throw error;
  }
}

// The calendar booking a "cancelled" notification is about, for the
// appointment details popup. Null if it has since been deleted.
export async function fetchNotificationBooking(bookingId) {
  const { data, error } = await supabase
    .from("appointment_details")
    .select("id, patient_name, contact_number, appointment_date, start_time, end_time, service, notes, status")
    .eq("id", bookingId)
    .maybeSingle();
  if (error) {
    console.error(`Could not load appointment ${bookingId}:`, describeError(error));
    throw error;
  }
  return data;
}

// The bell's data: the list, live updates through Supabase Realtime, and
// read actions. Read state is shared by all staff.
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      const rows = await fetchNotifications();
      setNotifications(rows);
      setError(null);
    } catch {
      // Already logged above.
      setError("Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    refreshScheduledNotifications().then(() => {
      if (!ignore) reload();
    });

    // Any insert (new booking) or update (read elsewhere) reloads the list,
    // so embedded request details and the order stay right.
    const channel = supabase
      .channel("staff-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        if (!ignore) reload();
      })
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [reload]);

  const markRead = useCallback(
    async (notificationId) => {
      setNotifications((rows) =>
        rows.map((row) => (row.id === notificationId ? { ...row, is_read: true } : row)),
      );
      try {
        await markNotificationRead(notificationId);
      } catch {
        reload();
      }
    },
    [reload],
  );

  const markAllRead = useCallback(async () => {
    setNotifications((rows) => rows.map((row) => ({ ...row, is_read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      setError("Couldn't mark notifications as read.");
      reload();
    }
  }, [reload]);

  const unreadCount = notifications.filter((row) => !row.is_read).length;

  return { notifications, unreadCount, loading, error, markRead, markAllRead };
}
