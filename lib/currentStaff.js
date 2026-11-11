import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { describeError } from "@/lib/errorLogging";

const ROLE_LABELS = { dentist: "Dentist", staff: "Staff" };

// "Dentist" or "Staff"; anything unknown or missing reads as "Staff".
export function formatRole(role) {
  return ROLE_LABELS[role] || "Staff";
}

// "Maria Santos" -> "MS", "Maria" -> "M", "ana@clinic.ph" -> "A".
export function getInitials(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1 || words[0].includes("@")) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// The signed-in staff member for the account menu:
// { name, role, email, avatarUrl }, or null while loading.
// Name, role and photo come from public.staff_profiles (see the
// staff_profiles migration); without a row it falls back to the email
// and "Staff", so the menu still works before that table is filled in.
export function useCurrentStaff() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        // The dashboard layout already sends signed-out visitors to /login.
        if (userError) console.error("Could not load the signed-in user:", describeError(userError));
        return;
      }
      const user = userData.user;

      const { data: profile, error: profileError } = await supabase
        .from("staff_profiles")
        .select("full_name, role, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profileError) {
        // Not fatal: the menu shows the email instead of a name.
        console.error(
          "Could not load the staff profile. Check the staff_profiles migration has been run:",
          describeError(profileError),
        );
      }

      if (ignore) return;
      setStaff({
        name: profile?.full_name || user.email || "Staff",
        role: formatRole(profile?.role),
        email: user.email || "",
        avatarUrl: profile?.avatar_url || null,
      });
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return staff;
}

// Resolves to null on success, or the error so the menu can say so and
// leave the session as it is.
export async function signOutStaff() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Could not log out:", describeError(error));
    return error;
  }
  return null;
}
