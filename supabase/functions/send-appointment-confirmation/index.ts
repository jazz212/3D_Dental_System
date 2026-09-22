// Emails a patient once staff have confirmed their appointment request.
//
// The browser sends only ids ({ requestId, bookingId }), never the email
// address or message. The function looks those up itself as the signed-in
// staff member, so it can't be used to send arbitrary email to anyone.
import { createClient } from "npm:@supabase/supabase-js@2";

const FROM_ADDRESS = "ToothPeak Dental Clinic <onboarding@resend.dev>";

// Lets the dashboard (a different origin) call this function from the browser.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Patient names come from the public booking form, so they must not be able
// to inject HTML into the email.
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// "2026-09-22" -> "Tuesday, September 22, 2026". Read and printed as UTC so
// the server's timezone can't shift it to the day before.
function formatDate(dateText) {
  return new Date(`${dateText}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// "13:30:00" -> "1:30 PM"
function formatTime(timeText) {
  const [hours, minutes] = timeText.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildEmail(patientName, booking) {
  const date = formatDate(booking.appointment_date);
  const time = `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`;

  const text = [
    `Hi ${patientName},`,
    "",
    "Your appointment at ToothPeak Dental Clinic is confirmed.",
    "",
    `Date: ${date}`,
    `Time: ${time}`,
    `Service: ${booking.service}`,
    "",
    "See you then!",
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(patientName)},</p>
    <p>Your appointment at ToothPeak Dental Clinic is confirmed.</p>
    <p>
      <strong>Date:</strong> ${escapeHtml(date)}<br />
      <strong>Time:</strong> ${escapeHtml(time)}<br />
      <strong>Service:</strong> ${escapeHtml(booking.service)}
    </p>
    <p>See you then!</p>
  `;

  return { text, html };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST." }, 405);
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set. Add it with: supabase secrets set RESEND_API_KEY=...");
      return jsonResponse({ error: "Email is not configured." }, 500);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Sign in first." }, 401);
    }

    // Acts as the signed-in staff member, so the tables' RLS policies decide
    // what this function can read.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return jsonResponse({ error: "Sign in first." }, 401);
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Send JSON: { requestId, bookingId }." }, 400);
    }
    const { requestId, bookingId } = body;
    if (!requestId || !bookingId) {
      return jsonResponse({ error: "Send JSON: { requestId, bookingId }." }, 400);
    }

    const { data: request, error: requestError } = await supabase
      .from("appointments")
      .select("status, requester_full_name, requester_email")
      .eq("id", requestId)
      .single();
    if (requestError) {
      console.error(`Could not load request ${requestId}. Check the id and that the caller is signed-in staff:`, requestError);
      return jsonResponse({ error: "Request not found." }, 404);
    }
    // Only email about requests that really ended up confirmed.
    if (request.status !== "confirmed") {
      return jsonResponse({ error: `Request is ${request.status}, not confirmed.` }, 409);
    }
    if (!request.requester_email) {
      return jsonResponse({ error: "This request has no email address." }, 422);
    }

    const { data: booking, error: bookingError } = await supabase
      .from("appointment_details")
      .select("appointment_date, start_time, end_time, service")
      .eq("id", bookingId)
      .single();
    if (bookingError) {
      console.error(`Could not load booking ${bookingId}. Check the id and that the caller is signed-in staff:`, bookingError);
      return jsonResponse({ error: "Booking not found." }, 404);
    }

    const { text, html } = buildEmail(request.requester_full_name, booking);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [request.requester_email],
        subject: "Your ToothPeak appointment is confirmed",
        text,
        html,
      }),
    });

    const resendResult = await resendResponse.json();
    if (!resendResponse.ok) {
      console.error(
        `Resend rejected the email for request ${requestId}. With onboarding@resend.dev you can only send to your own Resend account email until a domain is verified:`,
        resendResult,
      );
      return jsonResponse({ error: "Email provider rejected the message." }, 502);
    }

    return jsonResponse({ emailId: resendResult.id }, 200);
  } catch (error) {
    console.error("send-appointment-confirmation failed unexpectedly:", error);
    return jsonResponse({ error: "Unexpected error sending email." }, 500);
  }
});
