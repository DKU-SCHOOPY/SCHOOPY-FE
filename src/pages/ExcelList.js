import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";
import "./ExcelList.css";

export default function ExcelList() {
  const { eventId: paramEventId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const departmentFilter = params.get("department");

  const [eventId, setEventId] = useState(paramEventId || "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [events, setEvents] = useState([]); // 행사 목록

  // 행사 목록 불러오기 (실제 API 연동)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/SW융합대학학생회/get-active`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let eventList = res.data || [];
        if (departmentFilter) {
          eventList = eventList.filter((ev) => ev.department === departmentFilter);
        }
        setEvents(eventList);
      } catch (e) {
        alert("행사 목록 조회 실패: " + (e.response?.data?.message || e.message));
      }
    }
    fetchEvents();
  }, [departmentFilter]);

  useEffect(() => {
    if (paramEventId) setEventId(paramEventId);
  }, [paramEventId]);

  // 신청자 데이터 불러오기 (실제 API 연동)
  const fetchData = async (selectedEventId = eventId) => {
    if (!selectedEventId) {
      alert("행사를 선택하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/event/council/${selectedEventId}/export-data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { baseHeaders = [], questions = [], rows = [] } = res.data;
      setData(rows);

      const columns = questions.map((q) => ({
        id: q.questionId,
        text: q.questionText,
      }));
      setQuestionColumns(columns);

      setLoading(false);
    } catch (e) {
      alert("데이터 조회 실패: " + (e.response?.data?.message || e.message));
      setLoading(false);
    }
  };

  // 엑셀로 내보내기
  const exportExcel = () => {
    if (!data.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = data.map((item) => {
      const row = {
        학번: item.studentNum,
        이름: item.name,
        학과: item.department,
        생년월일: item.birthDay,
        성별: item.gender === "male" ? "남" : item.gender === "female" ? "여" : item.gender,
        전화번호: item.phoneNum,
        학생회비납부: item.councilPee ? "O" : "X",
      };
      questionColumns.forEach((q, idx) => {
        row[q.text] = item.answers?.[idx] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "신청자목록");
    XLSX.writeFile(wb, `event_${eventId}_신청자목록.xlsx`);
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">파일 다운로드</h2>
      <div className="event-list-section">
        <div className="event-list-title">행사 선택</div>
        <select
          className="event-dropdown"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          style={{ minWidth: 180, marginBottom: 16 }}
        >
          <option value="">행사를 선택하세요</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
      </div>
      <div className="excel-controls">
        <button
          onClick={() => fetchData(eventId)}
          disabled={loading || !eventId}
        >
          {loading ? "불러오는 중..." : "신청자 불러오기"}
        </button>
        <button onClick={exportExcel} disabled={!data.length}>
          엑셀로 내보내기
        </button>
      </div>
      <div>
        {data.length > 0 ? (
          <table className="excel-table">
            <thead>
              <tr>
                <th>학번</th>
                <th>이름</th>
                <th>학과</th>
                <th>생년월일</th>
                <th>성별</th>
                <th>전화번호</th>
                <th>학생회비납부</th>
                {questionColumns.map((q) => (
                  <th key={q.id}>{q.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.studentNum}</td>
                  <td>{item.name}</td>
                  <td>{item.department}</td>
                  <td>{item.birthDay}</td>
                  <td>
                    {item.gender === "male"
                      ? "남"
                      : item.gender === "female"
                        ? "여"
                        : item.gender}
                  </td>
                  <td>{item.phoneNum}</td>
                  <td>{item.councilPee ? "O" : "X"}</td>
                  {questionColumns.map((q, qidx) => (
                    <td key={q.id}>
                      {item.answers?.[qidx] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="excel-nodata">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}