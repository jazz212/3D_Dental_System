"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  // Phone-only slide-in menu. Lives here because both the Navbar (opens it)
  // and the Sidebar (is it) need it.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  if (checking) {
    return <div>Loading...</div>;
  }

  return (
    // h-dvh follows the phone's visible height as the browser bar hides/shows.
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      {/* min-w-0 lets wide tables scroll inside instead of stretching the page */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar onOpenMenu={() => setMobileNavOpen(true)} />
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
