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
  const [applicationStatus, setApplicationStatus] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const payload = { eventCode: parseInt(eventCode) };
        const response = await axios.post(`${API_BASE_URL}/home/get-event`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.code === "SU") {
          setEventData(response.data);
        } else {
          console.error("데이터 수신 실패:", response.data.message);
        }
      } catch (error) {
        console.error("이벤트 불러오기 실패:", error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const studentNum = localStorage.getItem("studentNum");

        if (!studentNum || !eventCode) {
          console.warn("학번 또는 eventCode가 유효하지 않습니다.");
          setApplicationStatus("none");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/student/application-status`, {
          params: { eventCode: Number(eventCode), studentNum },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        console.log("✅ 신청 상태 응답:", res.data);

        if (res.data.exists) {
          if (res.data.status === "APPROVED") {
            setApplicationStatus("approved");
          } else if (res.data.status === "PENDING") {
            setApplicationStatus("pending");
          } else {
            setApplicationStatus("none");
          }
        } else {
          setApplicationStatus("none");
        }
      } catch (error) {
        console.error("🚨 신청 상태 확인 오류:", error.response?.status, error.response?.data);

        if (error.response?.status === 403) {
          alert("인증이 만료되었거나 접근 권한이 없습니다. 다시 로그인해주세요.");
        }

        setApplicationStatus("none");
      }
    };

    fetchEvent();
    checkApplicationStatus();
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

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/events/${eventData.eventCode}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert("게시물이 삭제되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (!eventData) {
    return <div className="container">이벤트 정보를 불러오는 중...</div>;
  }

  const isApplicationPeriod = () => {
    if (!eventData?.surveyStartDate || !eventData?.surveyEndDate) return false;
    const now = new Date();
    const start = new Date(eventData.surveyStartDate);
    const end = new Date(eventData.surveyEndDate);
    return now >= start && now <= end;
  };

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
          <span className="event-info-value">{eventData.maxParticipant}명</span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon">📅</span>
          <span className="event-info-label">행사 날짜</span>
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

      {eventData.eventImages && eventData.eventImages.length > 0 && (
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

      {eventData.maxParticipant > 0 && role === "STUDENT" && (
        <>
          {applicationStatus === "approved" && (
            <div className="status-message success">
              🎉 행사 신청이 승인되었습니다. 신청해주셔서 감사합니다.
            </div>
          )}

          {applicationStatus === "pending" && (
            <div className="status-message info">
              ⏳ 이미 신청하셨습니다. 관리자 승인을 기다리고 있습니다.
            </div>
          )}

          {applicationStatus === "none" && (
            <>
              {isApplicationPeriod() ? (
                <button
                  className="big-button"
                  onClick={() => navigate(`/formquest/${eventData.eventCode}`)}
                >
                  신청하기
                </button>
              ) : (
                <div className="status-message warning">
                  현재는 신청 기간이 아닙니다.
                </div>
              )}
            </>
          )}
        </>
      )}

      {(role === "ADMIN" || role === "OFFICER") && (
        <button className="big-button delete-button" onClick={handleDelete}>
          게시물 삭제
        </button>
      )}
    </div>
  );
}

export default EventDetail;
