import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import './EditEvent.css'; // 버튼 스타일 등 공용 CSS 사용

export default function EventDetail() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);

  // 이벤트 상세 정보 불러오기
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/${eventCode}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEventData(res.data);
      } catch (err) {
        console.error("행사 정보 불러오기 실패", err);
        alert("행사 정보를 불러오는 데 실패했습니다.");
      }
    }
    fetchEvent();
  }, [eventCode]);

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 이 행사를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/event/council/delete-event/${eventCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("삭제 완료!");
      navigate("/"); // 홈으로 이동
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  if (!eventData) return <p>로딩 중...</p>;

  return (
    <div className="container">
      <h1 className="event-title">{eventData.eventName}</h1>
      <p>{eventData.eventDescription}</p>

      <div className="button-group">
        {/* 수정 버튼 클릭 시 EditEvent로 이동 */}
        <button
          className="big-button"
          onClick={() => navigate(`/events/edit/${eventCode}`)}
        >
          수정
        </button>

        {/* 삭제 버튼 클릭 시 바로 삭제 */}
        <button
          className="big-button delete-button"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
