// src/components/screens/CalendarScreen.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Header from "@/components/core/Header";
import { ScreenProps } from "@/types";

// NEW: Define a type for our notes object
type Notes = Record<string, string>; // Key will be "YYYY-MM-DD", value will be the note text

interface CalendarScreenProps extends ScreenProps {
  goBack: () => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({
  showScreen,
  showAlert,
  profile,
  goBack,
}) => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // --- NEW STATES ---
  const [notes, setNotes] = useState<Notes>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentNote, setCurrentNote] = useState("");

  // Helper to format a Date object into a "YYYY-MM-DD" string key
  const getDateKey = (date: Date): string => date.toISOString().split("T")[0];

  // Load note when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate);
      setCurrentNote(notes[dateKey] || "");
    } else {
      setCurrentNote("");
    }
  }, [selectedDate, notes]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = useCallback(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let date = 1;
    const weeks = [];

    for (let i = 0; i < 6; i++) {
      const days = [];
      let rowHasDate = false;
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth) {
          days.push(
            <td
              key={`empty-${i}-${j}`}
              className="bg-gray-50 p-3 border border-gray-200"></td>
          );
        } else {
          const fullDate = new Date(currentYear, currentMonth, date);
          const dateKey = getDateKey(fullDate);
          const isToday = dateKey === getDateKey(today);
          const isSelected =
            selectedDate && dateKey === getDateKey(selectedDate);
          const hasNote = notes[dateKey];

          let cellClasses =
            "p-3 border border-gray-200 cursor-pointer transition-colors relative";
          if (isToday) cellClasses += " bg-yellow-100 font-bold";
          if (isSelected) cellClasses += " bg-blue-200 ring-2 ring-blue-500";
          if (!isToday && !isSelected) cellClasses += " hover:bg-gray-100";

          days.push(
            <td
              key={`date-${date}`}
              className={cellClasses}
              onClick={() => setSelectedDate(fullDate)}>
              {hasNote && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
              )}
              {date}
            </td>
          );
          date++;
          rowHasDate = true;
        }
      }
      if (rowHasDate) weeks.push(<tr key={`week-${i}`}>{days}</tr>);
    }
    return weeks;
  }, [currentMonth, currentYear, selectedDate, notes, today]);

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
    setSelectedDate(null);
  };

  const handleSaveNote = () => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate);
    const updatedNotes = { ...notes, [dateKey]: currentNote };
    if (currentNote.trim() === "") delete updatedNotes[dateKey];
    setNotes(updatedNotes);
    showAlert("Note saved!", "success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Travel Calendar"
        onBack={goBack}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />
      <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}>
            {monthNames.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() + i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>
          <button
            className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg"
            onClick={() => changeMonth(-1)}>
            &#9664;
          </button>
          <button
            className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg"
            onClick={() => changeMonth(1)}>
            &#9654;
          </button>
        </div>

        <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
          <thead>
            <tr className="bg-yellow-400 text-gray-900">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="p-3 border border-gray-300 font-bold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>

        <div className="mt-5 space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedDate
              ? `Notes for: ${selectedDate.toLocaleDateString()}`
              : "Select a day to add a note"}
          </h3>
          <textarea
            placeholder="Add notes for your trip..."
            className="w-full p-4 border border-gray-300 rounded-lg disabled:bg-gray-100"
            rows={4}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            disabled={!selectedDate}
          />
          <button 
            className="cursor-pointer w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl disabled:bg-gray-300" 
            onClick={handleSaveNote}
            disabled={!selectedDate}>
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
