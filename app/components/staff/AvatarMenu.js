"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { getInitials, signOutStaff, useCurrentStaff } from "@/lib/currentStaff";

// open / onOpenChange come from the Navbar, so only one header panel is
// open at a time.
export default function AvatarMenu({ open, onOpenChange }) {
  const router = useRouter();
  const staff = useCurrentStaff();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  // A photo URL that no longer loads falls back to the initials.
  const [photoFailed, setPhotoFailed] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const menuItems = () => [...(menuRef.current?.querySelectorAll('[role="menuitem"]') || [])];

  useEffect(() => {
    if (!open) return;
    // Keyboard users land on the first item, as in any menu.
    menuItems()[0]?.focus();

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) onOpenChange(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  const closeAndReturnFocus = () => {
    onOpenChange(false);
    buttonRef.current?.focus();
  };

  // Arrow keys move between items; Escape closes; Tab leaves the menu.
  const handleMenuKeyDown = (e) => {
    const items = menuItems();
    const index = items.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      closeAndReturnFocus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      onOpenChange(false);
    }
  };

  const openSettings = () => {
    onOpenChange(false);
    router.push("/dashboard/settings");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    const error = await signOutStaff();
    if (error) {
      setLogoutError("Couldn't log out. Check your connection and try again.");
      setLoggingOut(false);
      return;
    }
    router.push("/login");
  };

  const showPhoto = staff?.avatarUrl && !photoFailed;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) closeAndReturnFocus();
        }}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="w-10 h-10 pointer-coarse:w-11 pointer-coarse:h-11 rounded-full flex items-center justify-center hover:bg-[#F0FDFA] transition-colors"
      >
        {!staff ? (
          // Still loading: a quiet grey circle, not an empty or broken one.
          <span aria-hidden="true" className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : showPhoto ? (
          // A plain img: the photo can be on any host, which next/image
          // would need listed in next.config.mjs.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={staff.avatarUrl}
            alt=""
            onError={() => setPhotoFailed(true)}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-[#00685F] text-white text-xs font-semibold flex items-center justify-center"
          >
            {getInitials(staff.name)}
          </span>
        )}
      </button>

      {open && (
        // Anchored to the right edge, where the avatar sits, and never wider
        // than the screen minus the page gutters.
        <div
          ref={menuRef}
          role="menu"
          aria-label="Account"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 mt-2 z-40 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-lg py-1"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            {staff ? (
              <>
                <p className="font-semibold text-gray-900 break-words">{staff.name}</p>
                <p className="text-sm text-[#00685F]">{staff.role}</p>
                <p className="mt-0.5 text-xs text-gray-500 break-all">{staff.email}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Loading your account...</p>
            )}
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={openSettings}
            className="w-full flex items-center gap-2 px-4 py-2.5 pointer-coarse:min-h-11 text-left text-sm text-gray-700 hover:bg-[#F0FDFA] hover:text-[#00685F] focus:bg-[#F0FDFA] focus:outline-none cursor-pointer"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            Settings
          </button>

          <div role="separator" className="my-1 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 pointer-coarse:min-h-11 text-left text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
          {logoutError && (
            <p role="alert" className="px-4 pb-2 text-xs text-red-600">
              {logoutError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
