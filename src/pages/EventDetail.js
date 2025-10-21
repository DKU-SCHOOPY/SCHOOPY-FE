import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import './EventDetail.css';

export default function EventDetail() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/${eventCode}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEventData(res.data);
      } catch (err) {
        console.error(err);
        alert("행사 정보를 불러오는 데 실패했습니다.");
      }
    }
    fetchEvent();
  }, [eventCode]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 행사를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/event/council/delete-event/${eventCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("삭제 완료!");
      navigate("/home"); // 삭제 후 홈으로 이동
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/events/edit/${eventCode}`);
  };

  if (!eventData) return <div>로딩중...</div>;

  return (
    <div className="container">
      <h1 className="event-title">{eventData.eventName}</h1>
      <p className="event-description">{eventData.eventDescription}</p>

      <div className="button-group">
        <button onClick={handleEdit} className="big-button edit-button">수정</button>
        <button onClick={handleDelete} className="big-button delete-button">삭제</button>
      </div>
    </div>
  );
}
