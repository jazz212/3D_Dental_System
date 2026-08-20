'use client';
import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarView() {
  const calendarRef = useRef(null); // ref to FullCalendar instance
  const wrapperRef = useRef(null);   // ref to the outer wrapper we observe

  // Re‑compute FullCalendar size whenever the wrapper (affected by sidebar) resizes
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(() => {
      calendarRef.current?.getApi()?.updateSize();
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const appointments = [
    { title: 'Juan Dela Cruz — Root Canal', date: '2026-06-21' },
    { title: 'Pedro Penduko — Cleaning',     date: '2026-06-22' },
  ];

  return (
    <div
      ref={wrapperRef}
      className="bg-white rounded-lg p-4 border border-gray-200"
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={appointments}
        height="auto"
      />
    </div>
  );
}