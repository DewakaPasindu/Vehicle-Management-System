// src/Calendar.js
import React, { useState } from 'react';
import './calendar.css'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push(
        <div key={day} className={`day ${isToday ? 'today' : ''}`}>
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (months) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + months)));
  };

  const changeYear = (years) => {
    setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + years)));
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={() => changeYear(-1)}>Y</button>
        <button onClick={() => changeMonth(-1)}>M</button>
        <div>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </div>
        <button onClick={() => changeMonth(1)}>M</button>
        <button onClick={() => changeYear(1)}>Y</button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-of-week">
            {day}
          </div>
        ))}
      </div>
      <div className="days">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
