import React, { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Calendar.css";

function Calendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [events, setEvents] = useState([]);

  // 초기 URL이 없을 경우 현재 날짜로 URL 설정
  useEffect(() => {
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      const curYear = now.getFullYear();
      const curMonth = now.getMonth() + 1;
      navigate(`/calendar?year=${curYear}&month=${curMonth}`, { replace: true });
    } else {
      const parsed = new Date(Number(year), Number(month) - 1);
      setCurrentDate(parsed);
    }
  }, []);

  // URL 연/월에 맞춰 이벤트 불러오기
  const fetchEvents = useCallback(async (year, month) => {
    try {
      const response = await fetch(
        `http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/calendar?year=${year}&month=${month}`
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      setEvents(
        data.map((event) => ({
          id: event.eventCode,
          title: event.title,
          start: event.start,
          end: event.end,
          color: "#edebfd",
        }))
      );
    } catch (err) {
      console.error("일정 로드 실패:", err.message);
    }
  }, []);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchEvents(year, month);
  }, [currentDate, fetchEvents]);

  // 날짜 상태 변경 + URL 갱신
  const updateDate = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    navigate(`/calendar?year=${year}&month=${month}`);
    setCurrentDate(newDate);
  };

  const renderHeader = () => {
    const month = format(currentDate, "MMMM");
    const year = format(currentDate, "yyyy");

    return (
      <div className="header-top-row">
        <button className="menu-button">☰</button>
        <div className="nav-compact">
          <span className="month">{month}</span>
          <span className="year">{year}</span>
          <button onClick={() => updateDate(subMonths(currentDate, 1))} className="nav-button">◀</button>
          <button onClick={() => updateDate(addMonths(currentDate, 1))} className="nav-button">▶</button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="days-row">
        {days.map((day) => (
          <div key={day} className="day-label">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      const currentRowStart = day;

      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day}
            className="cell"
            style={{
              color: isToday ? "white" : isCurrentMonth ? "#000" : "#ccc",
              fontWeight: isToday ? "bold" : "normal",
            }}
          >
            {isToday ? (
              <div className="today-circle">{formattedDate}</div>
            ) : (
              <div>{formattedDate}</div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={currentRowStart} className="week-row">
          <div className="week-grid">{days}</div>
          <div className="event-row">
            {events.map((event) => {
              const eventStart = parseISO(event.start);
              const eventEnd = parseISO(event.end);
              const isStartInWeek = isWithinInterval(eventStart, {
                start: currentRowStart,
                end: addDays(currentRowStart, 6),
              });

              if (isStartInWeek) {
                const dayOffset = differenceInCalendarDays(eventStart, currentRowStart);
                const spanEnd = eventEnd < addDays(currentRowStart, 6) ? eventEnd : addDays(currentRowStart, 6);
                const span = differenceInCalendarDays(spanEnd, eventStart) + 1;

                return (
                  <div
                    key={event.id}
                    className="event-block"
                    style={{
                      backgroundColor: event.color,
                      gridColumnStart: dayOffset + 1,
                      gridColumnEnd: `span ${span}`,
                    }}
                  >
                    {event.title}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
      days = [];
    }

    return <div className="cells-container">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      <div style={{ marginTop: "15px" }}>
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}

export default Calendar;
