export default function Dashboard(){

    const today = new Date().toLocaleDateString('en-US',{
        weekday: 'long',
        month: 'long',
        day: 'numeric'

    })
    return(
        <div className="bg-white h-full w-full p-4 pt-2">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className= "text-4xl font-bold">Overview</h1>
                    <p className="text-gray-500">Today is {today}</ p>
                 </div>

                 <div className="flex gap-4">
                    <button className="bg-[#00685F] px-4 py-2 text-white rounded-lg">Add New Patient</button>
                    <button className="bg-[#00685F] px-4 py-2 text-white rounded-lg">Add Appointment</button>
                 </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-6">
                <div className="bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
                    TODAY'S EXPECTED VISITS
                </div>  
                <div className="bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
                    PENDING APPOINTMENTS
                </div>
                <div className="bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
                    APPOINTMENT DURATION
                </div>       

            </div>
            
        </div>
        



    )
}