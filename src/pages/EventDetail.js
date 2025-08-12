import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css";
import { API_BASE_URL } from "../config";

function EventDetail() {
  const { eventCode } = useParams();
  const [eventData, setEventData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/home/get-event`, {
          eventCode: parseInt(eventCode),
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        if (response.data.code === "SU") {
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
      <h2 className="page-title">행사 안내</h2>
      <button onClick={() => window.history.back()} className="back-button">←</button>

      <div className="department-profile">
        <img
          src={`/images/departments/${eventData.department}.png`}
          alt={`${eventData.department} 로고`}
          className="department-image"
        />
        <span className="department-name">{eventData.department}</span>
      </div>

      <h1 className="event-title">{eventData.eventName}</h1>

      <div className="event-meta">
        <p><strong>주최</strong> | {eventData.department}</p>
        <p><strong>코드</strong> | {eventData.eventCode}</p>
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
    </div>
  );
}

export default EventDetail;
