import "./globals.css";

// Shown in the browser tab, bookmarks, shared links and a phone's
// "Add to Home Screen" label.
// Pages set their own short title; the template adds the clinic name.
export const metadata = {
  title: {
    default: "ToothPeak Dental Clinic",
    template: "%s · ToothPeak Dental Clinic",
  },
  description:
    "ToothPeak Dental Clinic in Tagaytay City. See our services and request an appointment online.",
};

export default function RootLayout({ children }) {
  return (
    // No web font: the design uses the system sans-serif (see DESIGN.md).
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
