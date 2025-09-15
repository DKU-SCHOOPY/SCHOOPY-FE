import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css";
import Header from "../components/Header";
import { API_BASE_URL } from "../config";

function EventDetail() {
  const navigate = useNavigate();
  const { eventCode } = useParams();
  const [eventData, setEventData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const payload = { eventCode: parseInt(eventCode) };

        const response = await axios.post(`${API_BASE_URL}/home/get-event`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.data.code === "SU") {
          console.log(response.data);
          setEventData(response.data);
        } else {
          console.error("데이터 수신 실패:", response.data.message);
        }
      } catch (error) {
        console.error("이벤트 불러오기 실패", error);
      }
    };

    fetchEvent();
  }, [eventCode]);

  const prevImage = () => {
    if (!eventData || eventData.eventImages.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? eventData.eventImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!eventData || eventData.eventImages.length === 0) return;
    setCurrentIndex((prev) =>
      prev === eventData.eventImages.length - 1 ? 0 : prev + 1
    );
  };

  if (!eventData) {
    return <div className="container">이벤트 정보를 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <Header title="행사 안내" showBack />

      <h1 className="event-title">{eventData.eventName}</h1>

      <div className="department-profile">
        <img
          src={`/images/departments/${eventData.department}.png`}
          alt={`${eventData.department} 로고`}
          className="department-image"
        />
        <span className="department-name">{eventData.department}</span>
      </div>



      <div className="event-info-container-vertical">
        <div className="event-info-row">
          <span className="event-info-icon">📢</span>
          <span className="event-info-label">주최</span>
          <span className="event-info-value">{eventData.department}</span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon">👥</span>
          <span className="event-info-label">모집인원</span>
          {/*<span className="event-info-value">100명</span>*/}
          <span className="event-info-value">{eventData.maxParticipant}명</span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon">📅</span>
          <span className="event-info-label">행사 날짜</span>
          {/*<span className="event-info-value">2025.08.20 ~ 2025.08.22</span>*/}
          <span className="event-info-value">{eventData.eventStartDate} ~ {eventData.eventEndDate}</span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon">📝</span>
          <span className="event-info-label">신청 날짜</span>
          <span className="event-info-value">{eventData.surveyStartDate} ~ {eventData.surveyEndDate}</span>
        </div>
      </div>



      <div className="event-description">
        {eventData.eventDescription?.split("\n").map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </div>


      {eventData.eventImages.length > 0 && (
        <div className="carousel">
          <button className="carousel-btn left" onClick={prevImage}>‹</button>
          <img
            src={eventData.eventImages[currentIndex]}
            alt={`포스터 ${currentIndex + 1}`}
            className="carousel-image"
          />
          <button className="carousel-btn right" onClick={nextImage}>›</button>
        </div>
      )}

      {eventData.hasForm && (
        <button
          className="big-button"
          onClick={() => navigate(`/formquest/${eventData.eventCode}`)}
        >
          신청하기
        </button>
      )}
    </div>
  );
}

export default EventDetail;
