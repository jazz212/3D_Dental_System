export default function Navbar(){
    return(
        <div className="bg-white h-16 w-full flex items-center text-black gap-2 px-4 justify-between border-b border-gray-500">

            <div>
                <input 
                    type="search" 
                    className="w-80 border border-gray-300 rounded-full px-4 py-2 outline-none" 
                    placeholder="Search patient name or appointments"/>
            </div>

            <div className="flex gap-4 items-center">
                <button >notif</button>
                <button className="">help</button>
                <div className="border-l border-gray-600 h-8   "></div>
                <span>Support</span>
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
            

        </div>
    )
}