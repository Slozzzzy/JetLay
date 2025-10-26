// src/components/screens/CalendarScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const CalendarScreen: React.FC<ScreenProps> = ({ showScreen, showAlert, profile }) => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarNote, setCalendarNote] = useState('');

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = useCallback((month: number, year: number) => {
    const firstDay = (new Date(year, month, 1)).getDay();
    const daysInMonth = (new Date(year, month + 1, 0)).getDate();
    let date = 1;
    const weeks = [];

    for (let i = 0; i < 6; i++) {
      const days = [];
      let rowHasDate = false;
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth) {
          days.push(<td key={`empty-${i}-${j}`} className="bg-gray-50 p-3 border border-gray-200"></td>);
        } else {
          days.push(<td key={`date-${date}`} className="p-3 border border-gray-200 hover:bg-yellow-100 cursor-pointer">{date}</td>);
          date++;
          rowHasDate = true;
        }
      }
      if (rowHasDate) {
        weeks.push(<tr key={`week-${i}`}>{days}</tr>);
      }
    }
    return weeks;
  }, []);

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title="Travel Calendar" onBack={() => showScreen('dashboard')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <select className="p-3 border border-gray-300 rounded-lg" value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))}>
            {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
          </select>
          <select className="p-3 border border-gray-300 rounded-lg" value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg" onClick={() => changeMonth(-1)}>&#9664;</button>
          <button className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg" onClick={() => changeMonth(1)}>&#9654;</button>
        </div>
        <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
          <thead>
            <tr className="bg-yellow-400 text-gray-900">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <th key={day} className="p-3 border border-gray-300 font-bold">{day}</th>)}
            </tr>
          </thead>
          <tbody>{renderCalendar(currentMonth, currentYear)}</tbody>
        </table>
        <div className="mt-5 space-y-3">
          <textarea placeholder="Add notes for your trip..." className="w-full p-4 border border-gray-300 rounded-lg" rows={4} value={calendarNote} onChange={(e) => setCalendarNote(e.target.value)}></textarea>
          <button className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl" onClick={() => showAlert('Note saved (demo)')}>Save Note</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;