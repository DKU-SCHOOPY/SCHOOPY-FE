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
  const [applicationStatus, setApplicationStatus] = useState(null); // 신청 상태
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const payload = { eventCode: parseInt(eventCode) };
        const response = await axios.post(`${API_BASE_URL}/home/get-event`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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


    const checkApplicationStatus = async () => {
      try {
        const studentNum = localStorage.getItem("studentNum");
        const res = await axios.post(
          `${API_BASE_URL}/event/student/application-status`,
          {
            eventCode: Number(eventCode),
            studentNum: studentNum
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.data.exists) {
          setApplicationStatus(res.data.approved ? "approved" : "pending");
        } else {
          setApplicationStatus("none");
        }
      } catch (error) {
        console.error("신청 상태 확인 오류:", error);
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

  if (!eventData) {
    return <div className="container">이벤트 정보를 불러오는 중...</div>;
  }
  // 신청 가능 여부 판단 함수
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

      {/* 신청하기 버튼: STUDENT만 */}
      {eventData.maxParticipant > 0 && role === "STUDENT" && (
        <>
          {applicationStatus === "approved" && (
            <div className="status-message success">
              🎉 행사 신청 승인되었습니다. 신청해주셔서 감사합니다.
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
                  className="event-big-button"
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
      {/* 학생회 버튼 */}
      {eventData.maxParticipant > 0 && role === "COUNCIL" && (
        <div>
          <button
            className="event-big-button edit-button"
            onClick={() => navigate(`/events/edit/${eventData.eventCode}`)}
          >
            수정
          </button>
          <button
            className="event-big-button delete-button"
            onClick={async () => {
              if (window.confirm("정말 이 이벤트를 삭제하시겠습니까?")) {
                try {
                  await axios.delete(`${API_BASE_URL}/event/council/delete-event/${eventData.eventCode}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                  });
                  alert("이벤트가 삭제되었습니다.");
                  navigate("/home");
                } catch (err) {
                  console.error(err);
                  alert("삭제 중 오류가 발생했습니다.");
                }
              }
            }}
          >
            삭제
          </button>
        </div>
      )}

    </div>
  );
}
export default EventDetail;
