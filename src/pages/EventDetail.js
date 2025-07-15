import React from "react";
import { useState } from "react";
import "./EventDetail.css";

function EventDetail() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const event = {
    title: "2025 소프트웨어학과 여름 세미나",
    date: "2025년 8월 11일 ~ 8월 13일",
    location: "융합관 501호",
    department: "소프트웨어학과",
    description: `
      ✔️ 세미나는 인공지능 기술과 SW산업의 흐름을 중심으로 진행됩니다.
      ✔️ 삼성전자 AI랩, 네이버 클로바팀 등 다양한 연사가 참여합니다.
      ✔️ 학과 학생들의 진로 탐색에 실질적인 도움이 되는 시간이 될 예정입니다.

      ❗세미나 후에는 네트워킹 간담회도 열릴 예정이니 많은 참여 바랍니다!
    `,
    images: [
      "/003.jpg",
      "/004.jpg",
      "/005.jpg",
    ],
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? event.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === event.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container">
      <h2 className="page-title">행사 안내</h2>
      <button onClick={() => window.history.back()} className="back-button">←</button>
      <div className="department-profile">
    <img
      src={`/images/departments/${event.department}.png`} // 예: 컴퓨터공학과 → 컴퓨터공학과.png
      alt={`${event.department} 로고`}
      className="department-image"
    />
    <span className="department-name">{event.department}</span>
  </div>
      
      <h1 className="event-title">{event.title}</h1>
      
      <div className="event-meta">
        <p><strong>일정</strong> | {event.date}</p>
        <p><strong>장소</strong> | {event.location}</p>
        <p><strong>주최</strong> | {event.department}</p>
      </div>
      <div className="event-description">
        {event.description.split("\n").map((line, idx) => (
          <p key={idx}>{line.trim()}</p>
        ))}
      </div>

      {/* 이미지 슬라이더 */}
      <div className="carousel">
        <button className="carousel-btn left" onClick={prevImage}>‹</button>
        <img
          src={event.images[currentIndex]}
          alt={`포스터 ${currentIndex + 1}`}
          className="carousel-image"
        />
        <button className="carousel-btn right" onClick={nextImage}>›</button>
      </div>
    </div>
  );
}

export default EventDetail;
