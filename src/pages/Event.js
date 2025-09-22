import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {API_BASE_URL} from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { eventCode } = useParams(); // id → eventCode로 명확히
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const filteredParticipants = participants.filter(p => {
    const name = p.user?.name || "";
    const dept = p.user?.department || "";
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.toLowerCase().includes(searchText.toLowerCase())
    );
  });


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

        console.log("응답 전체:", res);
        console.log("응답 데이터:", res.data);

        const data = res.data;

        const submissions = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];

        if (submissions.length === 0) {
          alert("신청자 없음");
        }

        const formatted = submissions.map(app => ({
          applicationId: app.applicationId,
          user: app.user,
          isStudent: app.isStudent,
          councilFeePaid: app.councilFeePaid,
          isPaymentCompleted: app.isPaymentCompleted
        }));

        setParticipants(formatted);
      } catch (e) {
        console.error("조회 오류:", e);
        alert("신청자 조회 중 오류");
      } finally {
        setLoading(false);
      }
    };


    if (eventCode) fetchEventData();
    else setLoading(false);
  }, [eventCode]);

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
        <button className="backbtn" onClick={() => navigate(-1)}>&larr;</button>
        <h2 className="title">신청자 목록</h2>
        <div className="rightspace" />
      </div>
      <div className="searchbox">
        <input
          className="searchinput"
          type="text"
          placeholder="이름 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
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
                <div className="username">{p.user?.name}</div>
                <div className="userstatus">
                  {p.isStudent ? "재학생" : "휴학생"} |
                  {p.councilFeePaid ? " 학생회비 납부" : " 학생회비 미납"} |
                  {p.isPaymentCompleted ? " 입금완료" : " 대기중"}
                </div>
              </div>
              <div className="actionbuttons" onClick={e => e.stopPropagation()}>
                {p.isPaymentCompleted ? (
                  <div className="approvedtext">승인완료</div>
                ) : (
                  <>
                    <button className="acceptbtn" onClick={e => { e.stopPropagation(); handleApprove(p.applicationId, true); }}>승인</button>
                    <button className="rejectbtn" onClick={e => { e.stopPropagation(); handleApprove(p.applicationId, false); }}>반려</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}