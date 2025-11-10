import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import "./Form.css";

function FormPage() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentNum, setStudentNum] = useState("");
  const [councilFeePaid, setCouncilFeePaid] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); 
  const [answerOpenId, setAnswerOpenId] = useState(null);


  const checkApplicationStatus = useCallback(async () => {
  if (!eventCode) return;
  try {
    const studentNum = localStorage.getItem("studentNum");
    const res = await axios.post(
      `${API_BASE_URL}/event/student/application-status`,
      { eventCode: Number(eventCode), studentNum },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (res.data.exists) {
      if (res.data.approved === true || res.data.status === "APPROVED") {
        setApplicationStatus("completed");
      } else if (res.data.approved === false || res.data.status === "PENDING") {
        setApplicationStatus("pending"); 
      } else {
        setApplicationStatus("none");
      }
    } else {
      setApplicationStatus("none");
    }
  } catch (error) {
    console.error("신청 상태 확인 오류:", error);
    setApplicationStatus("none");
  }
}, [eventCode]);



  useEffect(() => {
    if (!eventCode) return;

    axios
      .get(`${API_BASE_URL}/event/student/get-form/${eventCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("폼 불러오기 실패:", err);
        setLoading(false);
      });

    const storedStudentNum = localStorage.getItem("studentNum");
    if (storedStudentNum) setStudentNum(storedStudentNum);

    checkApplicationStatus();
  }, [eventCode, checkApplicationStatus]);

  if (loading) return <div>로딩중...</div>;
  if (!form) return <div>폼 정보를 불러올 수 없습니다.</div>;


  const getStatusMessage = () => {
    switch (applicationStatus) {
      case "pending":
        return { message: "이미 신청하셨습니다. 관리자 승인을 기다리고 있습니다.", type: "info" };
      case "completed":
        return { message: "🎉 행사 신청 승인 되었습니다. 신청해주셔서 감사합니다.", type: "success" };
      default:
        return null;
    }
  };
  const statusInfo = getStatusMessage();

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handlePayment = (remitType) => {
    let url = "";
    if (remitType === "토스") url = form.qr_toss_x;
    else if (remitType === "카카오페이") url = form.qr_kakaopay_x;

    if (url) {
      window.open(url, "_blank");
      setCouncilFeePaid(true);
    } else {
      alert(remitType + " QR 코드가 등록되어 있지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const q of form.questions) {
      if (q.required) {
        const value = answers[q.questionId];
        if (q.questionType === "MULTIPLE_CHOICE" && q.multiple && (!value || value.length === 0)) {
          alert(`필수 질문: "${q.questionText}"에 답변을 선택해 주세요.`);
          return;
        }
        if (q.questionType === "MULTIPLE_CHOICE" && !value) {
          alert(`필수 질문: "${q.questionText}"에 답변을 선택해 주세요.`);
          return;
        }
        if (q.questionType !== "MULTIPLE_CHOICE" && (!value || value.trim() === "")) {
          alert(`필수 질문: "${q.questionText}"에 답변을 입력해 주세요.`);
          return;
        }
      }
    }

    const answerArr = form.questions.map((q) => {
      if (q.questionType === "MULTIPLE_CHOICE" && q.multiple)
        return { questionId: q.questionId, answerList: answers[q.questionId] || [] };
      if (q.questionType === "MULTIPLE_CHOICE")
        return { questionId: q.questionId, answerList: answers[q.questionId] ? [answers[q.questionId]] : [] };
      return { questionId: q.questionId, answerText: answers[q.questionId] || "" };
    });

    const payload = {
      studentNum,
      eventCode: Number(eventCode),
      answer: answerArr,
    };

    try {
      await axios.post(`${API_BASE_URL}/event/student/application`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("🎉 행사 신청 되었습니다. 신청해주셔서 감사합니다.");
      setApplicationStatus("completed"); 
      navigate("/home");
    } catch (err) {
      alert("신청 중 오류: " + (err.response?.data?.message || err.message));
      // navigate("/home");
    }
  };


  const hasRemitQR = !!(form.qr_toss_x || form.qr_kakaopay_x);


  const isApplicationPeriod = (() => {
    const now = new Date();
    const start = new Date(form.surveyStartDate);
    const end = new Date(form.surveyEndDate);
    end.setDate(end.getDate() +1); //하루 더한 방식
    return now >= start && now <= end;
  })();

  if (!isApplicationPeriod)
    return (
      <div className="container">
        <Header title="행사 신청" showBack />
        <div className="status-message warning">현재는 신청 기간이 아닙니다.</div>
        <button className="back-button" onClick={() => navigate("/formlist")}>
          목록으로 돌아가기
        </button>
      </div>
    );

  return (
    <div className="container">
      <Header title="행사 신청" showBack />

      {statusInfo && <div className={`status-message ${statusInfo.type}`}>{statusInfo.message}</div>}

      {applicationStatus === "none" ? (
        <>
          <p className="form-description">아래 항목을 작성하여 신청해 주세요.</p>
          <form className="form" onSubmit={handleSubmit}>
            {form.questions.map((q, idx) => (
              <div className="form-group" key={q.questionId}>
                <div className="question-label">
                  {idx + 1}. {q.questionText}
                  {q.required && <span style={{ color: "red" }}> *</span>}
                </div>

                <div className="answer-input">
                  {q.questionType === "MULTIPLE_CHOICE" ? (
                    q.multiple ? (
                      <div className="option-chips">
                        {q.choices.map((opt) => (
                          <label key={opt} className="option-chip">
                            <input
                              type="checkbox"
                              checked={(answers[q.questionId] || []).includes(opt)}
                              onChange={(e) => {
                                const prev = answers[q.questionId] || [];
                                handleAnswerChange(
                                  q.questionId,
                                  e.target.checked
                                    ? [...prev, opt]
                                    : prev.filter((v) => v !== opt)
                                );
                              }}
                            />
                            <span className="chip-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="dropdown">
                        <div
                          className="dropdown-selected"
                          onClick={() =>
                            setAnswerOpenId(answerOpenId === q.questionId ? null : q.questionId)
                          }
                        >
                          {answers[q.questionId] || "선택하세요"}
                          <span className="arrow">
                            {answerOpenId === q.questionId ? "▲" : "▼"}
                          </span>
                        </div>

                        {answerOpenId === q.questionId && (
                          <div className="dropdown-menu">
                            {q.choices.map((opt) => (
                              <div
                                key={opt}
                                className={`dropdown-item ${
                                  answers[q.questionId] === opt ? "selected" : ""
                                }`}
                                onClick={() => {
                                  handleAnswerChange(q.questionId, opt);
                                  setAnswerOpenId(null);
                                }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <input
                      className="input"
                      type="text"
                      value={answers[q.questionId] || ""}
                      onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                      placeholder="답변을 입력하세요"
                    />
                  )}
                </div>
              </div>
            ))}

            {hasRemitQR ? (
              <>
                <div style={{ height: 24 }} />
                <div className="button-group">
                  <button
                    type="button"
                    className={`payment-button toss ${councilFeePaid ? "disabled" : ""}`}
                    onClick={() => handlePayment("토스")}
                    disabled={councilFeePaid}
                  >
                    토스로 송금하기
                  </button>

                  <button
                    type="button"
                    className={`payment-button kakao ${councilFeePaid ? "disabled" : ""}`}
                    onClick={() => handlePayment("카카오페이")}
                    disabled={councilFeePaid}
                  >
                    카카오페이로 송금하기
                  </button>
                </div>

                <button className="big-button" type="submit" disabled={!councilFeePaid}>
                  {councilFeePaid ? "신청하기" : "송금 후 신청 가능"}
                </button>
              </>
            ) : (
              <button className="big-button" type="submit">
                신청하기
              </button>
            )}
          </form>
        </>
      ) : (
        <div className="application-status-container">
          <div className="status-icon">{applicationStatus === "completed" ? "✅" : "⏳"}</div>
          <div className="status-text">
            {applicationStatus === "completed"
              ? "신청이 완료되었습니다 🎉"
              : "신청이 완료되었습니다. 관리자의 승인을 기다리고 있습니다."}
          </div>
          <button className="back-button" onClick={() => navigate("/formlist")}>
            목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}

export default FormPage;
