import Link from "next/link"
export default function Sidebar(){
    return(
        <div className = "bg-white h-screen flex flex-col p-4 w-64 gap-2 text-black">
            
            <img src="/Logo/ToothPeakLogo.jpg" className= ""/>
            <div className="bg-[#00685F] p-2">
                <button type ="button">Add Patient</button>
            </div>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/patient">Patient Records</Link>
            <Link href="/calendar">Calendar</Link>
            <Link href="/3dchart">3D Chart</Link>
            <Link href="/settings">Setttings</Link>
            <Link href="/logout" className="mt-auto">Logout</Link>    
            
            

            
        </div>
    )
}