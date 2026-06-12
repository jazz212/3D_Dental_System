import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
export default function Home() {
  return (
    <div className="bg-gray-100 flex">
        <Sidebar/>
        <Navbar/>
    </div>
  )
}