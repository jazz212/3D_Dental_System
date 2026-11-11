// The clinic's contact details in one place, so every page shows the same
// number, hours and address, and links to the same map.

export const CLINIC_PHONE = "0966 990 8551";

// tel: links need the international form (+63, without the leading 0) so
// a tap dials correctly from any phone.
export const CLINIC_PHONE_LINK = "tel:+639669908551";

export const CLINIC_ADDRESS =
  "FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway, cor. Airborne St., Maharlika East, Tagaytay City.";

// Days the clinic is open, as Date.getDay() numbers (0 = Sunday). Matches the
// hours on the public pages: Tue – Sat, closed Sunday and Monday.
export const CLINIC_OPEN_WEEKDAYS = [2, 3, 4, 5, 6];
export const CLINIC_OPEN_DAYS_TEXT = "Tuesday to Saturday";

// Official hours aren't confirmed yet (see PRODUCT.md); change them here only.
export const CLINIC_HOURS = "Tue – Sat, 9:00 AM – 5:00 PM";
export const CLINIC_CLOSED_DAYS = "Closed Sunday and Monday";

// Opens turn-by-turn directions in Google Maps (the app on phones).
export const CLINIC_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=ToothPeak%20Dental%20Clinic%2C%20FGC%20Building%2C%20Tagaytay-Nasugbu%20Road%2C%20Tagaytay%20City";

// "0917 555-1234" -> "tel:+639175551234". Phone numbers are typed in freely,
// so everything but digits and a leading + is dropped, and a local leading 0
// becomes +63 (same rule as CLINIC_PHONE_LINK above). Returns null when
// there is nothing to dial.
export function toTelLink(phoneNumber) {
  const digitsOnly = (phoneNumber || "").replace(/[^\d+]/g, "");
  if (digitsOnly.length < 7) return null;
  const international = digitsOnly.startsWith("0")
    ? `+63${digitsOnly.slice(1)}`
    : digitsOnly;
  return `tel:${international}`;
}
