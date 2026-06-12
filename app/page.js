import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
export default function Home() {
  return (
    <div className="bg-gray-100 flex">
      <div className="flex h-screen">
          <Sidebar/>
      </div>
      <div className="flex flex-1 flex-col">
          <Navbar/>
          <Dashboard/>
      </div>
        
        
        
    </div>
  )
}