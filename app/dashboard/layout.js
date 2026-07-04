import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
export default function ({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
