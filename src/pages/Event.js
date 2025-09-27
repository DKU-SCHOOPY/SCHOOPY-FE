import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const filteredParticipants = participants.filter(p => {
    const name = p.name || "";
    const dept = p.department || "";
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/submissions/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        console.log("응답 데이터:", res.data);
        const submissions = Array.isArray(res.data) ? res.data : [];

        if (submissions.length === 0) {
          alert("신청자 없음");
        }

        // 서버에서 내려주는 실제 필드명에 맞춤
        const formatted = submissions.map(app => ({
          applicationId: app.applicationId,
          name: app.name,
          department: app.department,
          gender: app.gender,
          studentNum: app.studentNum,
          councilFeePaid: app.councilPee,       // 서버 오타 그대로 받는 경우
          isPaymentCompleted: app.paymentCompleted,
          isStudent: app.isStudent ?? true      // 없으면 기본값 재학생
        }));

        setParticipants(formatted);
      } catch (e) {
        console.error("조회 오류:", e);
        alert("신청자 조회 중 오류");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
    else setLoading(false);
  }, [eventId]);

  const handleApprove = async (applicationId, isAccept) => {
    try {
      if (!isAccept) {
        const confirmed = window.confirm("반려하시겠습니까? 신청이 삭제됩니다.");
        if (!confirmed) return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/event/council/approve`,
        {
          applicationId: Number(applicationId),
          choice: isAccept ? "True" : "False"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("서버 응답:", res.data);

      if (res.data.updatedStatus === true && isAccept) {
        alert("승인 완료");
        setParticipants(prev =>
          prev.map(p =>
            p.applicationId === applicationId
              ? { ...p, isPaymentCompleted: true }
              : p
          )
        );
      } else if (res.data.updatedStatus === false && !isAccept) {
        alert("반려 완료");
        setParticipants(prev =>
          prev.filter(p => p.applicationId !== applicationId)
        );
      } else {
        alert("처리 실패");
        console.log("응답 이상:", res.data);
      }
    } catch (err) {
      console.error("승인 처리 오류:", err);
      alert("서버 오류");
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <button className="backbtn" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h2 className="title">신청자 목록</h2>
        <div className="rightspace" />
      </div>

      <div className="searchbox">
        <input
          className="searchinput"
          type="text"
          placeholder="이름/학과 검색"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <div className="userlist">
          {filteredParticipants.length === 0 ? (
            <div className="noapplicants">신청자가 없습니다.</div>
          ) : (
            filteredParticipants.map(p => (
              <div
                key={p.applicationId}
                className="userrow"
                onClick={() => navigate(`/answer/${p.applicationId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="userinfo">
                  <div className="username">
                    {p.name} ({p.studentNum})
                  </div>
                  <div className="userstatus">
                    {p.isStudent ? "재학생" : "휴학생"} | {p.department} |{" "}
                    {p.councilFeePaid ? " 학생회비 납부" : " 학생회비 미납"} |{" "}
                    {p.isPaymentCompleted ? " 입금완료" : " 대기중"}
                  </div>
                </div>
                <div className="actionbuttons" onClick={e => e.stopPropagation()}>
                  {p.isPaymentCompleted ? (
                    <div className="approvedtext">승인완료</div>
                  ) : (
                    <>
                      <button
                        className="acceptbtn"
                        onClick={e => {
                          e.stopPropagation();
                          handleApprove(p.applicationId, true);
                        }}
                      >
                        승인
                      </button>
                      <button
                        className="rejectbtn"
                        onClick={e => {
                          e.stopPropagation();
                          handleApprove(p.applicationId, false);
                        }}
                      >
                        반려
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
