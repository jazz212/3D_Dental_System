'use client'
/*installed this in the terminal
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
then imported the component in the dashboard
*/ 
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarView() {
    const appointments = [
        {
            title: 'Juan Dela Cruz — Root Canal',
            date: '2026-06-21'
        },
        {
            title: 'Pedro Penduko — Cleaning',
            date: '2026-06-22'
        }
    ]

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={appointments}
                height="auto"
            />
        </div>
    )
}