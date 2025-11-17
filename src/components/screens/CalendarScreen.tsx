import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

// NEW: Define a type for our notes object
type Notes = Record<string, string>; // Key will be "YYYY-MM-DD", value will be the note text

const CalendarScreen: React.FC<ScreenProps> = ({ showScreen, showAlert, profile }) => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // --- NEW STATES ---
  // 1. To store all notes for all days
  const [notes, setNotes] = useState<Notes>({});
  // 2. To track the currently clicked-on day
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 3. To hold the note for the selected day (in the textarea)
  const [currentNote, setCurrentNote] = useState('');
  
  // Helper to format a Date object into a "YYYY-MM-DD" string key
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // --- NEW: EFFECT ---
  // When the user clicks a new day (selectedDate changes),
  // load that day's note (if any) into the textarea.
  useEffect(() => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate);
      setCurrentNote(notes[dateKey] || ''); // Load existing note or an empty string
    } else {
      setCurrentNote(''); // No day selected, clear textarea
    }
  }, [selectedDate, notes]);

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
          // --- UPDATED DAY CELL LOGIC ---
          const fullDate = new Date(year, month, date);
          const dateKey = getDateKey(fullDate);
          
          const isToday = dateKey === getDateKey(today);
          const isSelected = selectedDate && dateKey === getDateKey(selectedDate);
          const hasNote = notes[dateKey];

          // Build dynamic classes for the cell
          let cellClasses = "p-3 border border-gray-200 cursor-pointer transition-colors relative";
          if (isToday) cellClasses += " bg-yellow-100 font-bold";
          if (isSelected) cellClasses += " bg-blue-200 ring-2 ring-blue-500";
          if (!isToday && !isSelected) cellClasses += " hover:bg-gray-100";

          days.push(
            <td 
              key={`date-${date}`} 
              className={cellClasses}
              onClick={() => setSelectedDate(fullDate)} // Set this day as selected
            >
              {/* Show a dot if the day has a note */}
              {hasNote && <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>}
              {date}
            </td>
          );
          date++;
          rowHasDate = true;
        }
      }
      if (rowHasDate) {
        weeks.push(<tr key={`week-${i}`}>{days}</tr>);
      }
    }
    return weeks;
  }, [currentMonth, currentYear, selectedDate, notes, today]); // Add dependencies

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
    setSelectedDate(null); // Clear selection when changing month
  };

  // --- NEW: Save Handler ---
  const handleSaveNote = () => {
    if (!selectedDate) return; // Safety check

    const dateKey = getDateKey(selectedDate);
    
    // Create a copy of the notes and set the new note
    const updatedNotes = {
      ...notes,
      [dateKey]: currentNote,
    };
    
    // If the note is empty, we can remove the key
    if (currentNote.trim() === '') {
      delete updatedNotes[dateKey];
    }

    setNotes(updatedNotes); // Save to our main state
    showAlert('Note saved!', 'success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title="Travel Calendar" onBack={() => showScreen('dashboard')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
        {/* --- Calendar Controls (No change) --- */}
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
        
        {/* --- Calendar Table (No change) --- */}
        <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
          <thead>
            <tr className="bg-yellow-400 text-gray-900">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <th key={day} className="p-3 border border-gray-300 font-bold">{day}</th>)}
            </tr>
          </thead>
          <tbody>{renderCalendar(currentMonth, currentYear)}</tbody>
        </table>

        {/* --- UPDATED NOTES SECTION --- */}
        <div className="mt-5 space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedDate 
              ? `Notes for: ${selectedDate.toLocaleDateString()}` 
              : 'Select a day to add a note'
            }
          </h3>
          <textarea 
            placeholder="Add notes for your trip..." 
            className="w-full p-4 border border-gray-300 rounded-lg disabled:bg-gray-100" 
            rows={4} 
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            disabled={!selectedDate} // Disable if no day is selected
          />
          <button 
            className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl disabled:bg-gray-300" 
            onClick={handleSaveNote}
            disabled={!selectedDate} // Disable if no day is selected
          >
            Save Note
          </button>CheckCircleIcon
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;