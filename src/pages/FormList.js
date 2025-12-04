import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilterBar from "../components/FilterBar";
import './FormList.css';
import { API_BASE_URL } from "../config";
import Header from "../components/Header";

const BASE_FILTERS = [
  "전체", "SW융합대학", "소프트웨어학과", "컴퓨터공학과", "통계데이터사이언스학과", "사이버보안학과"
];

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const FormList = () => {
  const role = localStorage.getItem("role");
  const isCouncil = role === "COUNCIL";
  
  // COUNCIL일 때 두번째 순서에 "주관행사" 추가
  const FILTERS = isCouncil 
    ? [BASE_FILTERS[0], "주관행사", ...BASE_FILTERS.slice(1)]
    : BASE_FILTERS;
  
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [councilEvents, setCouncilEvents] = useState([]); // 주관행사 이벤트
  const navigate = useNavigate();

  // 일반 이벤트 가져오기
  useEffect(() => {
    async function fetchEvents() {
      try {
        // 원래 엔드포인트 사용 (서버가 role을 확인해서 COUNCIL인 경우 모든 이벤트 반환)
        const res = await axios.get(
          `${API_BASE_URL}/event/student/get-active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("Raw API Response:", res.data);

        if (!res.data || !Array.isArray(res.data)) {
          console.error("Invalid API response format:", res.data);
          return;
        }

        const mapped = res.data.map(ev => {
          console.log("Processing event:", ev);
          const mappedEvent = {
            id: ev.eventCode,
            name: ev.eventName,
            department: ev.department,
            startDate: ev.eventStartDate,
            endDate: ev.eventEndDate,
            surveyStartDate: ev.surveyStartDate,
            surveyEndDate: ev.surveyEndDate,
            total: parseInt(ev.maxParticipants) || 0,
            current: parseInt(ev.currentParticipants) || 0,
            description: ev.eventDescription,
            eventImages: ev.eventImages || [],
            qrCodeImages: ev.qrCodeImages || []
          };
          console.log("Mapped event:", mappedEvent);
          return mappedEvent;
        });

        console.log("All mapped events:", mapped);
        setEvents(mapped);
      } catch (err) {
        console.error("이벤트 데이터를 불러오는 데 실패했습니다:", err);
        console.error("Error details:", err.response?.data || err.message);
      }
    }

    fetchEvents();
  }, [role]);

  // 주관행사 이벤트 가져오기 (COUNCIL이고 필터가 "주관행사"일 때)
  useEffect(() => {
    async function fetchCouncilEvents() {
      if (!isCouncil || filter !== "주관행사") {
        setCouncilEvents([]);
        return;
      }

      try {
        const department = localStorage.getItem("department");
        if (!department) {
          console.error("department가 없습니다.");
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/event/council/${department}/get-event`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("주관행사 API Response:", res.data);

        if (!res.data || !res.data.events || !Array.isArray(res.data.events)) {
          console.error("Invalid 주관행사 API response format:", res.data);
          setCouncilEvents([]);
          return;
        }

        const mapped = res.data.events.map(ev => {
          const mappedEvent = {
            id: ev.eventCode,
            name: ev.eventName,
            department: res.data.department || department,
            startDate: ev.eventStartDate,
            endDate: ev.eventEndDate,
            surveyStartDate: ev.eventStartDate, // 주관행사 API에는 survey 날짜가 없으므로 event 날짜 사용
            surveyEndDate: ev.eventEndDate,
            total: 0, // 주관행사 API에는 참가자 정보가 없음
            current: 0,
            description: "",
            eventImages: [],
            qrCodeImages: []
          };
          return mappedEvent;
        });

        console.log("주관행사 mapped events:", mapped);
        setCouncilEvents(mapped);
      } catch (err) {
        console.error("주관행사 이벤트 데이터를 불러오는 데 실패했습니다:", err);
        console.error("Error details:", err.response?.data || err.message);
        setCouncilEvents([]);
      }
    }

    fetchCouncilEvents();
  }, [filter, isCouncil]);

  // 필터가 "주관행사"인 경우 councilEvents 사용, 아니면 일반 events 사용
  const eventsToFilter = filter === "주관행사" ? councilEvents : events;
  
  const filteredEvents = eventsToFilter.filter(ev =>
    (filter === "전체" || filter === "주관행사" || ev.department === filter) &&
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Current filter:", filter);
  console.log("Current search:", search);
  console.log("Filtered events:", filteredEvents);

  return (
    <div className="container">
      <Header title="신청 폼 목록" showBack={false} />
      {/* <h2 className="page-title">신청 폼 목록</h2> */}

      <div className="searchbox">
        <input
          className="searchinput"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 필터바 컴포넌트 적용 */}
      <FilterBar filters={FILTERS} selected={filter} onSelect={setFilter} />

      <div className="form-event-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">등록된 이벤트가 없습니다.</div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="form-event-card"
              onClick={() => navigate(`/form/${ev.id}`)}
            >
              <div className="form-event-title">{ev.name}</div>
              <div className="form-event-period">
                {formatDate(ev.surveyStartDate)} ~ {formatDate(ev.surveyEndDate)}
              </div>
              <div className="progress-row">
                <div className="progress-text">{ev.current}/{ev.total}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(ev.current / ev.total) * 100}%`,
                      background: ev.id % 2 === 0 ? "#ffd36e" : "#7ed957",
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default FormList;