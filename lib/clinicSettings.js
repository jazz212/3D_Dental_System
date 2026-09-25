import { supabase } from "@/lib/supabase";

// clinic_settings holds exactly one row; a CHECK constraint keeps its id at 1.
const CLINIC_SETTINGS_ID = 1;

// operating_hours is a JSON list, one entry per day:
// [{ day: "Monday", isOpen: true, openTime: "08:00", closeTime: "18:00" }, ...]
export async function fetchOperatingHours() {
  const { data, error } = await supabase
    .from("clinic_settings")
    .select("operating_hours")
    .eq("id", CLINIC_SETTINGS_ID)
    .single();

  if (error) {
    console.error("Could not load operating hours. Check you're signed in:", error);
    throw error;
  }
  return data.operating_hours;
}

export async function saveOperatingHours(operatingHours) {
  // .select().single() makes a blocked or missing row an error: without it,
  // an update that matches no rows still "succeeds" and nothing is saved.
  const { error } = await supabase
    .from("clinic_settings")
    .update({
      operating_hours: operatingHours,
      updated_at: new Date().toISOString(),
    })
    .eq("id", CLINIC_SETTINGS_ID)
    .select("id")
    .single();

  if (error) {
    console.error("Could not save operating hours. Check you're signed in:", error);
    throw error;
  }
}
