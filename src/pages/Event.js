import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 신청자 조회
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/submissions/${eventCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // 서버에서 문자열로 올 경우 parse
        let data = res.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (err) {
            console.error("JSON 파싱 실패:", err);
            data = [];
          }
        }

        setParticipants(Array.isArray(data) ? data : []);
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

  // 승인 / 반려
  const handleApprove = async (applicationId, isAccept) => {
    try {
      if (!isAccept) {
        const confirmed = window.confirm(
          "반려하시겠습니까? 신청이 삭제됩니다."
        );
        if (!confirmed) return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/event/council/approve`,
        {
          applicationId: Number(applicationId),
          choice: isAccept ? "True" : "False",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.updatedStatus === true && isAccept) {
        alert("승인 완료");
        setParticipants((prev) =>
          prev.map((p) =>
            p.applicationId === applicationId
              ? { ...p, isPaymentCompleted: true }
              : p
          )
        );
      } else if (res.data.updatedStatus === false && !isAccept) {
        alert("반려 완료");
        setParticipants((prev) =>
          prev.filter((p) => p.applicationId !== applicationId)
        );
      } else {
        alert("처리 실패");
        console.log("응답 이상:", res.data);
      }
    } catch (err) {
      console.error("승인/반려 오류:", err);
      alert("서버 오류 발생");
    }
  };

  if (loading) return <div className="container">로딩 중...</div>;

  return (
    <div className="container">
      <div className="topbar">
        <button className="backbtn" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h2 className="title">신청자 목록</h2>
        <div className="rightspace" />
      </div>

      {participants.length === 0 ? (
        <div className="noapplicants">신청자가 없습니다.</div>
      ) : (
        <div className="userlist">
          {participants.map((p) => (
            <div
              key={p.applicationId}
              className="userrow"
              onClick={() => navigate(`/answer/${p.applicationId}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="userinfo">
                <div className="username">{p.user?.name}</div>
                <div className="userstatus">
                  {p.isStudent ? "재학생" : "휴학생"} |{" "}
                  {p.councilFeePaid ? "학생회비 납부" : "학생회비 미납"} |{" "}
                  {p.isPaymentCompleted ? "입금완료" : "대기중"}
                </div>
              </div>
              <div
                className="actionbuttons"
                onClick={(e) => e.stopPropagation()}
              >
                {p.isPaymentCompleted ? (
                  <div className="approvedtext">승인완료</div>
                ) : (
                  <>
                    <button
                      className="acceptbtn"
                      onClick={() =>
                        handleApprove(p.applicationId, true)
                      }
                    >
                      승인
                    </button>
                    <button
                      className="rejectbtn"
                      onClick={() =>
                        handleApprove(p.applicationId, false)
                      }
                    >
                      반려
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
