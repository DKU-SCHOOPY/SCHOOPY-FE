import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
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

  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const departmentList = Array.from(
    new Set(events.map((event) => event.department).filter(Boolean))
  );

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

  const fetchEvents = useCallback(async (year, month) => {
    try {
      const token = localStorage.getItem("token");
    console.log("토큰 확인:", token);

    const response = await axios.get(
       `${API_BASE_URL}/event/all/calendar?year=${year}&month=${month}`,
       {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
    );

    console.log("응답 전체:", response);
    console.log("응답 데이터:", response.data);

    const data = response.data;

    setEvents(
      data.map((event) => ({
        id: event.eventCode,
        title: event.title,
        start: event.start,
        end: event.end,
        department: event.department,
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
        <button className="menu-button" onClick={() => setShowSidebar(true)}>☰</button>
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
        {days.map((day, idx) => (
          <div
            key={day}
            className="day-label"
            style={{ color: idx === 0 ? "#4a39e4ff" : undefined }} // 일요일 빨간색
          >
            {day}
          </div>
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

  const filteredEvents = events.filter(
    (event) =>
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(event.department)
  );

  while (day <= endDate) {
    const currentRowStart = day;

    // 이번 주(7일) 각 날짜별 이벤트 개수 카운트 맵
    const eventCountMap = {};
    filteredEvents.forEach((event) => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      const weekStart = currentRowStart;
      const weekEnd = addDays(currentRowStart, 6);

      if (eventEnd < weekStart || eventStart > weekEnd) return;

      const visibleStart = eventStart < weekStart ? weekStart : eventStart;
      const visibleEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

      let iter = visibleStart;
      while (iter <= visibleEnd) {
        const key = format(iter, "yyyy-MM-dd");
        eventCountMap[key] = (eventCountMap[key] || 0) + 1;
        iter = addDays(iter, 1);
      }
    });

    // 이번 주 전체 이벤트 중 상위 3개까지만 표시
    // (긴 블록은 그대로 유지)
    const eventsToShow = filteredEvents.filter((event, idx) => idx < 3);

    for (let i = 0; i < 7; i++) {
      const thisDay = day;
      const formattedDate = format(thisDay, "d");
      const isCurrentMonth = isSameMonth(thisDay, currentDate);
      const isToday = isSameDay(thisDay, new Date());

      const isSunday = thisDay.getDay() === 0;

      const cellStyle = {
        color: isToday
          ? "white"
          : isSunday
          ? "#5511f3ff"
          : isCurrentMonth
          ? "#000"
          : "#ccc",
        fontWeight: isToday ? "bold" : "normal",
      };

      days.push(
        <div
          key={thisDay.toISOString()}
          className="calendar-day-box"
          onClick={() => setSelectedDate(new Date(thisDay))}
        >
          <div className="cell" style={cellStyle}>
            {isToday ? (
              <div className="today-circle">{formattedDate}</div>
            ) : (
              <div>{formattedDate}</div>
            )}
          </div>
          <div className="event-placeholder" />
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={currentRowStart} className="week-row">
        <div className="week-grid">{days}</div>

        <div
          className="event-row"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const cellWidth = rect.width / 7;
            const dayIndex = Math.floor(clickX / cellWidth);
            const clickedDate = addDays(currentRowStart, dayIndex);
            setSelectedDate(new Date(clickedDate));
          }}
          style={{ position: "relative" }}
        >
          {eventsToShow.map((event) => {
            const eventStart = parseISO(event.start);
            const eventEnd = parseISO(event.end);
            const weekStart = currentRowStart;
            const weekEnd = addDays(currentRowStart, 6);

            if (eventEnd < weekStart || eventStart > weekEnd) return null;

            const visibleStart = eventStart < weekStart ? weekStart : eventStart;
            const visibleEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

            const startCol = differenceInCalendarDays(visibleStart, weekStart);
            const span = differenceInCalendarDays(visibleEnd, visibleStart) + 1;

            return (
              <div
                key={event.id + "_" + weekStart.toISOString()}
                className="event-block"
                style={{
                  backgroundColor: event.color,
                  gridColumnStart: startCol + 1,
                  gridColumnEnd: `span ${span}`,
                }}
                title={event.title}
              >
                {event.title}
              </div>
            );
          })}

          {/* 각 날짜별 이벤트가 4개 이상일 때 ... 표시 */}
          {[...Array(7)].map((_, idx) => {
            const date = addDays(currentRowStart, idx);
            const key = format(date, "yyyy-MM-dd");
            if ((eventCountMap[key] || 0) > 3) {
              return (
                <div
                  key={"ellipsis_" + key}
                  className="event-ellipsis"
                  style={{
                    gridColumnStart: idx + 1,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    lineHeight: "1",
                    userSelect: "none",
                    cursor: "default",
                    color: "#555",
                  }}
                >
                ···
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
      {showSidebar && (
        <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <h3>학과 필터</h3>
            {departmentList.map((dept) => (
              <label key={dept} className="checkbox-label">
                <input
                  type="checkbox"
                  value={dept}
                  checked={selectedDepartments.includes(dept)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedDepartments((prev) =>
                      checked ? [...prev, dept] : prev.filter((d) => d !== dept)
                    );
                  }}
                />
                {dept}
              </label>
            ))}
          </div>
        </div>
      )}
      {renderHeader()}
      <div style={{ marginTop: "15px" }}>
        {renderDays()}
        {renderCells()}
        {selectedDate && (
          <div className="popup-backdrop" onClick={() => setSelectedDate(null)}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h4>{format(selectedDate, "yyyy-MM-dd")} 일정</h4>
              {events
                .filter((e) => {
                  const start = parseISO(e.start);
                  const end = parseISO(e.end);
                  return selectedDate >= start && selectedDate <= end;
                })
                .map((e) => (
                  <div
                    key={e.id}
                    className="popup-event"
                    onClick={() => navigate(`/eventdetail/${e.id}`)}
                  >
                    {e.title}
                  </div>
                ))}

              {events.filter(e => isWithinInterval(selectedDate, { start: parseISO(e.start), end: parseISO(e.end) })).length === 0 && (
                <p>해당 날짜에 일정 없음</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
