import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilterBar from "../components/FilterBar";
import './FormList.css';
import { API_BASE_URL } from "../config";
import Header from "../components/Header";

const FILTERS = [
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
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    async function fetchEvents() {
      try {
        // COUNCIL role인 경우 모든 이벤트를 가져오는 엔드포인트 사용 시도
        let endpoint = `${API_BASE_URL}/event/student/get-active`;
        if (role === "COUNCIL") {
          // COUNCIL용 엔드포인트가 있다면 사용, 없으면 기존 엔드포인트 사용
          // 서버가 role을 확인해서 모든 이벤트를 반환할 것으로 예상
          endpoint = `${API_BASE_URL}/event/council/get-all`;
        }

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }).catch(async (err) => {
          // COUNCIL용 엔드포인트가 없으면 기존 엔드포인트로 폴백
          if (role === "COUNCIL" && err.response?.status === 404) {
            console.log("COUNCIL용 엔드포인트가 없어 기존 엔드포인트 사용");
            return await axios.get(`${API_BASE_URL}/event/student/get-active`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
          }
          throw err;
        });

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

  const filteredEvents = events.filter(ev =>
    (filter === "전체" || ev.department === filter) &&
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