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
  yearsToDays,
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

  //const departmentList = Array.from(new Set(events.map((event) => event.department))).filter(Boolean);
  const departmentList = ["컴퓨터공학", "전자공학", "기계공학", "경영학"];


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
//   const fetchEvents = useCallback(async (year, month) => {
//   try {

//     const token = localStorage.getItem("accessToken");
//     console.log("토큰 확인:", token);

//     const response = await axios.get(
// //        `${API_BASE_URL}/event/calendar?year=${year}&month=${month}`,
// //   //     {
// //   // headers: {
// //   //   Authorization: `Bearer ${token}`
// //   // }
// // // }
// //     );

//     console.log("응답 전체:", response);
//     console.log("응답 데이터:", response.data);

//     const data = response.data;
    
//     setEvents(
//       data.map((event) => ({
//         id: event.eventCode,
//         title: event.title,
//         start: event.start,
//         end: event.end,
//         department: event.department,
//         color: "#edebfd",
//       }))
    
//     );
//   } catch (err) {
//     console.error("일정 로드 실패:", err.message);
//   }
// }, []);

  const fetchEvents = useCallback(async (year, month) => {
  try {
    // 임의 일정 데이터
    const mockData = [
      {
        eventCode: "ev1",
        title: "컴퓨터공학 세미나",
        start: `${year}-${month.toString().padStart(2, "0")}-10`,
        end: `${year}-${month.toString().padStart(2, "0")}-12`,
        department: "컴퓨터공학",
      },
      {
        eventCode: "ev2",
        title: "전자공학 발표",
        start: `${year}-${month.toString().padStart(2, "0")}-15`,
        end: `${year}-${month.toString().padStart(2, "0")}-15`,
        department: "전자공학",
      },
      {
        eventCode: "ev3",
        title: "기계공학 워크숍",
        start: `${year}-${month.toString().padStart(2, "0")}-18`,
        end: `${year}-${month.toString().padStart(2, "0")}-20`,
        department: "기계공학",
      },
    ];

    setEvents(
      mockData.map((event) => ({
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

    const filteredEvents = events.filter((event) =>
      selectedDepartments.length === 0 || selectedDepartments.includes(event.department)
    );

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
            {filteredEvents.map((event) => {
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
                    title={event.title}      // 마우스 오버 시 툴팁으로 제목 보여줌
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

//   const renderSidebar = () => {
//   if (!showSidebar) return null;

//   return (
//     <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)}>
//       <div className="sidebar" onClick={(e) => e.stopPropagation()}>
//         <h3>학과 필터</h3>
//         {departmentList.map((dept) => (
//           <label key={dept} className="checkbox-label">
//             <input
//               type="checkbox"
//               value={dept}
//               checked={selectedDepartments.includes(dept)}
//               onChange={(e) => {
//                 const checked = e.target.checked;
//                 setSelectedDepartments((prev) =>
//                   checked ? [...prev, dept] : prev.filter((d) => d !== dept)
//                 );
//               }}
//             />
//             {dept}
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };



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
      </div>
    </div>
  );
}

export default Calendar;
