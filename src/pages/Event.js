import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 안전한 JSON 파싱 함수
  const safeParseJSON = (data) => {
    if (!data) return [];
    if (typeof data === "object") return data; // 이미 배열일 경우
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("JSON 파싱 실패, 재처리 시도:", e);
      try {
        const fixed = data
          .replace(/\\"/g, '"')  // 이스케이프된 따옴표 제거
          .replace(/^"|\s*"$|^\[\"|\]\"$/g, ""); // 양끝 불필요한 따옴표 제거
        return JSON.parse(fixed);
      } catch (e2) {
        console.error("복구 실패:", e2);
        return [];
      }
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/submissions/${eventCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const submissions = safeParseJSON(res.data);

        if (submissions.length === 0) {
          alert("신청자가 없습니다.");
        }

        const formatted = submissions.map(app => ({
          applicationId: app.applicationId,
          user: app.user,
          isStudent: app.isStudent,
          councilFeePaid: app.councilFeePaid,
          isPaymentCompleted: app.isPaymentCompleted
        }));

        setParticipants(formatted);
      } catch (err) {
        console.error("신청자 조회 오류:", err);
        alert("신청자 조회 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    if (eventCode) fetchEventData();
    else setLoading(false);
  }, [eventCode]);

  return (
    <div className="container">
      <div className="topbar">
        <button className="backbtn" onClick={() => navigate(-1)}>&larr;</button>
        <h2 className="title">신청자 목록</h2>
        <div className="rightspace" />
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <div className="userlist">
          {participants.length === 0 ? (
            <div className="noapplicants">신청자가 없습니다.</div>
          ) : (
            participants.map(p => (
              <div
                key={p.applicationId}
                className="userrow"
                onClick={() => navigate(`/answer/${p.applicationId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="userinfo">
                  <div className="username">{p.user?.name}</div>
                  <div className="userstatus">
                    {p.isStudent ? "재학생" : "휴학생"} |
                    {p.councilFeePaid ? " 학생회비 납부" : " 학생회비 미납"} |
                    {p.isPaymentCompleted ? " 입금완료" : " 대기중"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
