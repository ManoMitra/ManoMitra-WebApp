
import React, { useState, useMemo, useEffect } from 'react';
import { Reminder } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  reminders: Reminder[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateChange, reminders }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(selectedDate);

  useEffect(() => {
    if (selectedDate.getFullYear() !== currentMonthDate.getFullYear() || selectedDate.getMonth() !== currentMonthDate.getMonth()) {
        setCurrentMonthDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate, currentMonthDate]);


  const firstDayOfMonth = useMemo(() => new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1), [currentMonthDate]);
  const daysInMonth = useMemo(() => new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate(), [currentMonthDate]);

  const remindersByDate = useMemo(() => {
    const map = new Map<string, number>();
    reminders.forEach(r => {
      map.set(r.date, (map.get(r.date) || 0) + 1);
    });
    return map;
  }, [reminders]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200"></div>);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      date.setHours(0, 0, 0, 0);
      const isPast = date < today;

      const classList = [
        "relative", "p-2", "text-center", "text-sm", 
        "border-r", "border-b", "border-gray-200", 
        "transition-colors", "duration-200"
      ];

      if (isPast) {
          classList.push("bg-gray-300", "text-gray-500", "cursor-not-allowed");
      } else if (isSelected) {
          classList.push("bg-blue-600", "text-white", "font-bold", "cursor-pointer");
      } else {
          classList.push("cursor-pointer", "hover:bg-blue-100");
          if (isToday) {
              classList.push("bg-blue-100", "text-blue-700", "font-bold");
          }
      }
      
      days.push(
        <div 
            key={day} 
            className={classList.join(' ')} 
            onClick={!isPast ? () => onDateChange(date) : undefined}
        >
          <span>{day}</span>
          {remindersByDate.has(dateString) && (
            <div className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></div>
          )}
        </div>
      );
    }
    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {weekdays.map(day => (
          <div key={day} className="py-2 text-center font-semibold text-xs text-gray-500 border-r border-b border-gray-200 bg-gray-50">{day}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarView;