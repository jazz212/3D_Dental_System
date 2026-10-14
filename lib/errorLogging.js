// Turns an error into text for console.error, keeping only its message and
// code. Two reasons:
// - Supabase errors are plain objects, which the Next.js error overlay shows
//   as "{}"; as text the real Postgres message stays visible.
// - Their `details` (and sometimes `hint`) repeat the row's values: a unique
//   violation echoes the email, a check violation the whole failing row.
//   Leaving those out keeps patient data out of the console.
export function describeError(error) {
  if (!error) return String(error);
  const parts = [error.message || String(error)];
  if (error.code) parts.push(`code: ${error.code}`);
  return parts.join(" | ");
}
