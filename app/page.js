import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    /**/
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <div className="overflow-y-auto flex-1">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
