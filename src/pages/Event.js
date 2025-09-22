import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 폼 질문 및 신청자 응답 상태 추가
  const [eventName, setEventName] = useState("");
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // 반려 모달 상태
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  // 학과 정보: 참가자 중 첫 번째로 department가 있는 학생의 학과
  const department = useMemo(() => {
    const found = participants.find(p => p.user?.department);
    return found ? found.user.department : "";
  }, [participants]);

  const filteredParticipants = participants.filter((p) => {
    if (!p.user) return false;
    const name = p.user.name || "";
    const dept = p.user.department || "";
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // 신청자 목록 및 폼 질문/응답 데이터 모두 불러오기
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // 신청자 목록
        const res = await axios.get(
          `${API_BASE_URL}/event/council/submissions/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = res.data;
        console.log(data);
        const submissions = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];
        const formatted = submissions.map((app) => ({
          applicationId: app.applicationId,
          user: app.user,
          isStudent: app.isStudent,
          councilFeePaid: app.councilFeePaid,
          isPaymentCompleted: app.isPaymentCompleted,
        }));
        setParticipants(formatted);

        // 행사 폼 질문 및 신청자 응답
        const excelRes = await axios.get(
          `${API_BASE_URL}/event/council/${eventId}/export-data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEventName(excelRes.data.eventName || "");
        setBaseHeaders(excelRes.data.baseHeaders || []);
        setQuestionColumns(excelRes.data.questions || []);
        setRows(excelRes.data.rows || []);
      } catch (e) {
        console.error("조회 오류:", e);
        alert("신청자/폼 데이터 조회 중 오류");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
    else setLoading(false);
  }, [eventId]);

  const handleApprove = async (applicationId, isAccept, reason = "") => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/event/council/approve`,
        {
          applicationId: Number(applicationId),
          choice: isAccept ? "True" : "False",
          reason: isAccept ? null : reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.updatedStatus === true && isAccept) {
        alert("승인 완료");
        setParticipants((prev) =>
          prev.map((p) =>
            p.applicationId === applicationId
              ? { ...p, isPaymentCompleted: true }
              : p
          )
        );
      } else if (response.data.updatedStatus === false && !isAccept) {
        alert("반려 완료");
        setParticipants((prev) =>
          prev.filter((p) => p.applicationId !== applicationId)
        );
      } else {
        alert("처리 실패");
      }
    } catch (err) {
      console.error("승인 처리 오류:", err);
      alert("서버 오류");
    }
  };

  const openRejectModal = (applicationId) => {
    setRejectTarget(applicationId);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("반려 사유를 입력하세요.");
      return;
    }
    handleApprove(rejectTarget, false, rejectReason);
    setRejectReason("");
    setShowRejectModal(false);
    setRejectTarget(null);
  };

  // 엑셀로 내보내기
  const exportExcel = () => {
    if (!rows.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = rows.map((item) => {
      const row = {};
      baseHeaders.forEach((header) => {
        row[header] = item[header];
      });
      questionColumns.forEach((q, idx) => {
        row[q.questionText] = item.answers?.[idx] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "신청자목록");
    XLSX.writeFile(wb, `event_${eventId}_신청자목록.xlsx`);
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
          placeholder="이름 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="userlist">
        {filteredParticipants.length === 0 ? (
          <div className="noapplicants">신청자가 없습니다.</div>
        ) : (
          filteredParticipants.map((p) => (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(p.applicationId, true);
                      }}
                    >
                      승인
                    </button>
                    <button
                      className="rejectbtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRejectModal(p.applicationId);
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

      {/* 오른쪽 하단 파일 다운 버튼 */}
      <button
        className="file-download-fab"
        onClick={exportExcel}
        title="엑셀 파일 다운로드"
        disabled={loading || !rows.length}
      >
        파일
        <br />
        다운
      </button>

      {/* 반려 사유 모달 */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>반려 사유 작성</h3>
            <textarea
              className="reject-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력하세요"
            />
            <div className="modal-buttons">
              <button onClick={confirmReject} className="confirmbtn">
                확인
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setRejectTarget(null);
                }}
                className="cancelbtn"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
