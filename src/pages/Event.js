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

useEffect(() => {
  const fetchEventData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/event/council/submissions/${eventCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("데이터", res.data);
      const submissions = res.data;

      if (!Array.isArray(submissions) || submissions.length === 0) {
        alert("신청자가 없습니다.");
        setParticipants([]);
        return;
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
