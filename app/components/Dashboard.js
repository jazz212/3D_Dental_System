export default function Dashboard(){

    const today = new Date().toLocaleDateString('en-US',{
        weekday: 'long',
        month: 'long',
        day: 'numeric'

    })
    return(
        <div className="bg-white h-full w-full">
            <div className="flex justify-between items-center p-4">
                <div>
                    <h1 className= "text-4xl font-bold">Overview</h1>
                    <p className="text-gray-500">Today is {today}</ p>
                 </div>
                    <button className="bg-[#00685F] px-4 py-2 text-white rounded-lg">Add New Patient</button>
                
                
            </div>
            
        </div>
        



    )
}