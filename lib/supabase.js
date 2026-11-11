import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Without these, createClient fails with an unclear message and every page
// that talks to the database crashes. Set both in .env.local and in Vercel.
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to .env.local (and the Vercel project settings), then restart.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);