import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";
import "./Event.css";

export default function EventApplicants() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 폼 질문 및 신청자 응답 상태
  const [eventName, setEventName] = useState("");
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // 반려 모달 상태
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  // 참가자 중 첫 번째 학과
  const department = useMemo(() => {
    const found = participants.find((p) => p.user?.department);
    return found ? found.user.department : "";
  }, [participants]);

  const filteredParticipants = participants.filter((p) => {
    if (!p.user) return false;
    if (!searchText.trim()) return true;
    const name = p.user.name || "";
    const dept = p.user.department || "";
    return (
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // 신청자 목록
        const res = await axios.get(
          `${API_BASE_URL}/event/council/submissions/${eventCode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data;
        const submissions = Array.isArray(data) ? data : data.data || [];

        // user 매핑 수정
        const formatted = submissions.map((app) => {
          // user 객체가 app.user 안에 있음
          const userData = app.user || {};
          return {
            applicationId: app.applicationId,
            user: {
              name: userData.name || "이름없음",
              department: userData.department || "학과없음",
              studentNum: userData.studentNum || "",
              email: userData.email || "",
            },
            isStudent: app.isStudent ?? true,
            councilFeePaid: app.councilPee ?? false,
            isPaymentCompleted: app.isPaymentCompleted ?? false,
            answers: app.answers || [],
          };
        });

        setParticipants(formatted);
        console.log("Participants 상태:", formatted);

        // 폼 질문 및 신청자 응답
        const excelRes = await axios.get(
          `${API_BASE_URL}/event/council/${eventCode}/export-data`,
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

    if (eventCode) fetchEventData();
    else setLoading(false);
  }, [eventCode]);

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

  // 한글 컬럼명 매핑
  const headerMap = {
    studentNum: "학번",
    name: "이름",
    department: "학과",
    birthDay: "생년월일",
    gender: "성별",
    phoneNum: "전화번호",
    councilPee: "학생회비납부",
  };

  const exportExcel = () => {
    if (!rows.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = rows.map((item) => {
      const row = {};
      baseHeaders.forEach((header) => {
        const colName = headerMap[header] || header;
        // 성별 한글 변환
        if (header === "gender") {
          row[colName] = item.gender === "female" ? "여자" : item.gender === "male" ? "남자" : item.gender;
        }
        // 학생회비납부 O/X 변환
        else if (header === "councilPee") {
          row[colName] = item.councilPee ? "O" : "X";
        }
        else {
          row[colName] = item[header];
        }
      });
      questionColumns.forEach((q, idx) => {
        row[q.questionText] = item.answers?.[idx] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "신청자목록");
    XLSX.writeFile(wb, `event_${eventCode}_신청자목록.xlsx`);
  };

  return (
    <div className="container">
      <div className="topbar">
        <button className="backbtn" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h2 className="title">{eventName || "신청자 목록"}</h2>
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
        {loading ? (
          <div>로딩중...</div>
        ) : filteredParticipants.length === 0 ? (
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
                  {p.isStudent ? "재학생" : "휴학생"} |{" "}
                  {p.councilFeePaid ? " 학생회비 납부" : " 학생회비 미납"} |{" "}
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

      <button
        className="file-download-fab"
        onClick={exportExcel}
        title="엑셀 파일 다운로드"
        disabled={loading || !rows.length}
      >
        다운
      </button>

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
