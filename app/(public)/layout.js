import PublicHeader from "@/app/components/public/PublicHeader";
import Footer from "@/app/components/public/Footer";

// Wraps every page in the (public) folder: the clinic website patients see.
// The parentheses keep "(public)" out of the URL, so /services stays /services.
// flex-col + flex-1 keeps the footer at the bottom on short pages.
export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F8] text-[#1F2D28]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
