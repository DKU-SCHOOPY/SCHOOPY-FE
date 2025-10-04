import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  //const [isStudent, setIsStudent] = useState(false);
  const [councilFeePaid, setCouncilFeePaid] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // 신청 상태: null(확인중), 'none'(신청안함), 'pending'(대기중), 'approved'(승인됨), 'rejected'(반려됨)

  // 학생의 신청 상태 확인 함수
  const checkApplicationStatus = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/event/student/application-status/${eventCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // 서버에서 반환하는 상태에 따라 설정
      // 서버에서 반환하는 필드명에 따라 조정 필요
      if (res.data && res.data.status) {
        setApplicationStatus(res.data.status); // 'none', 'pending', 'approved', 'rejected'
      } else {
        setApplicationStatus('none'); // 신청하지 않은 상태
      }
    } catch (error) {
      console.error('신청 상태 확인 오류:', error);
      // API가 없거나 오류가 발생한 경우 신청 가능한 상태로 설정
      setApplicationStatus('none');
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/event/student/get-form/${eventCode}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        setForm(res.data);
        setLoading(false);
      });

    // 학번 자동 세팅
    const storedStudentNum = localStorage.getItem("studentNum");
    if (storedStudentNum) {
      setStudentNum(storedStudentNum);
    }

    // 신청 상태 확인
    checkApplicationStatus();
  }, [eventCode]);

  if (loading) return <div>로딩중...</div>;
  if (!form) return <div>폼 정보를 불러올 수 없습니다.</div>;

  // 신청 상태에 따른 메시지 반환
  const getStatusMessage = () => {
    switch (applicationStatus) {
      case 'pending':
        return { message: '이미 신청하셨습니다. 관리자 승인을 기다리고 있습니다.', type: 'info' };
      case 'approved':
        return { message: '이미 승인된 신청입니다.', type: 'success' };
      case 'rejected':
        return { message: '이전 신청이 반려되었습니다. 다시 신청할 수 있습니다.', type: 'warning' };
      case 'none':
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // 송금 버튼 클릭 시
  const handlePayment = (remitType) => {
    let url = "";
    if (remitType === "토스") {
      url = form.qr_toss_x; // 토스 QR URL
    } else if (remitType === "카카오페이") {
      url = form.qr_kakaopay_x; // 카카오페이 QR URL
    }
    if (url) {
      window.open(url, "_blank");
      setCouncilFeePaid(true);
      alert(remitType + " 송금 완료");
    } else {
      alert(remitType + " QR 코드가 등록되어 있지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 질문 미답변 체크
    for (const q of form.questions) {
      if (q.required) {
        if (q.questionType === "MULTIPLE_CHOICE" && q.multiple) {
          // 체크박스(복수선택)
          if (!answers[q.questionId] || answers[q.questionId].length === 0) {
            alert(`필수 질문: "${q.questionText}"에 답변을 선택해 주세요.`);
            return;
          }
        } else if (q.questionType === "MULTIPLE_CHOICE") {
          // 라디오(단일선택)
          if (!answers[q.questionId]) {
            alert(`필수 질문: "${q.questionText}"에 답변을 선택해 주세요.`);
            return;
          }
        } else {
          // 주관식
          if (!answers[q.questionId] || answers[q.questionId].trim() === "") {
            alert(`필수 질문: "${q.questionText}"에 답변을 입력해 주세요.`);
            return;
          }
        }
      }
    }

    const answerArr = form.questions.map(q => {
      if (q.questionType === "MULTIPLE_CHOICE" && q.multiple) {
        return {
          questionId: q.questionId,
          answerList: answers[q.questionId] || []
        };
      } else if (q.questionType === "MULTIPLE_CHOICE") {
        return {
          questionId: q.questionId,
          answerList: answers[q.questionId] ? [answers[q.questionId]] : []
        };
      } else {
        return {
          questionId: q.questionId,
          answerText: answers[q.questionId] || ""
        };
      }
    });

    const payload = {
      studentNum,
      eventCode: Number(eventCode), // 숫자 타입으로 변환
      //isStudent,
      answer: answerArr
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/event/student/application`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert(res.data.message);
      navigate('/formlist');
    } catch (err) {
      alert("신청 중 오류: " + (err.response?.data?.message || err.message));
    }
  };

  // 송금 QR URL이 있는지 확인
  const hasRemitQR = !!(form.qr_toss_x || form.qr_kakaopay_x);

  return (
    <div className="container">
      <Header title="행사 신청" showBack />

      {/* 신청 상태 메시지 표시 */}
      {statusInfo && (
        <div className={`status-message ${statusInfo.type}`}>
          {statusInfo.message}
        </div>
      )}

      {/* 신청 가능한 상태일 때만 폼 표시 */}
      {(applicationStatus === 'none' || applicationStatus === 'rejected') ? (
        <>
          <p className="form-description">아래 항목을 작성하여 신청해 주세요.</p>
          <form className="form" onSubmit={handleSubmit}>
            {/* 동적 질문 폼 */}
            {form.questions.map((q, idx) => (
              <div className="form-group" key={q.questionId}>
                <div className="question-label">
                  {idx + 1}. {q.questionText}
                  {q.required && <span style={{ color: "red" }}> *</span>}
                </div>
                <div className="answer-input">
                  {q.questionType === "MULTIPLE_CHOICE" ? (
                    q.multiple ? (
                      // 체크박스 그룹
                      <div className="option-chips">
                        {q.choices.map(opt => (
                          <label key={opt} className="option-chip">
                            <input
                              type="checkbox"
                              checked={(answers[q.questionId] || []).includes(opt)}
                              onChange={e => {
                                const prev = answers[q.questionId] || [];
                                if (e.target.checked) {
                                  handleAnswerChange(q.questionId, [...prev, opt]);
                                } else {
                                  handleAnswerChange(q.questionId, prev.filter(v => v !== opt));
                                }
                              }}
                            />
                            <span className="chip-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      // 단일 선택 select
                      <select
                        className="input"
                        value={answers[q.questionId] || ""}
                        onChange={e => handleAnswerChange(q.questionId, e.target.value)}
                      >
                        <option value="">선택하세요</option>
                        {q.choices.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )
                  ) : (
                    <input
                      className="input"
                      type="text"
                      value={answers[q.questionId] || ""}
                      onChange={e => handleAnswerChange(q.questionId, e.target.value)}
                      placeholder="답변을 입력하세요"
                    />
                  )}
                </div>
              </div>
            ))}
            {/* 재학생 여부
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isStudent}
              onChange={e => setIsStudent(e.target.checked)}
            />
            재학생입니다
          </label>
        </div>
*/}
            {/* 송금 버튼/신청 버튼 조건부 렌더링 */}
            {hasRemitQR ? (
              <>
                <div style={{ height: 24 }} />
                <div className="button-group">
                  <button
                    type="button"
                    className={`payment-button ${councilFeePaid ? "disabled" : ""}`}
                    onClick={() => handlePayment("토스")}
                    disabled={councilFeePaid}
                  >
                    토스로 송금하기
                  </button>
                  <button
                    type="button"
                    className={`payment-button ${councilFeePaid ? "disabled" : ""}`}
                    onClick={() => handlePayment("카카오페이")}
                    disabled={councilFeePaid}
                    style={{ background: '#ffe600', color: '#222' }}
                  >
                    카카오페이로 송금하기
                  </button>
                </div>
                <button
                  className="big-button"
                  type="submit"
                  disabled={!councilFeePaid}
                >
                  {councilFeePaid ? "신청하기" : "송금 후 신청 가능"}
                </button>
              </>
            ) : (
              <button
                className="big-button"
                type="submit"
              >
                신청하기
              </button>
            )}
          </form>
        </>
      ) : (
        // 이미 신청했거나 승인된 경우 대체 메시지 표시
        <div className="application-status-container">
          <div className="status-icon">
            {applicationStatus === 'pending' && '⏳'}
            {applicationStatus === 'approved' && '✅'}
          </div>
          <div className="status-text">
            {applicationStatus === 'pending' && '신청이 완료되었습니다. 관리자의 승인을 기다리고 있습니다.'}
            {applicationStatus === 'approved' && '신청이 승인되었습니다. 행사에 참여하실 수 있습니다.'}
          </div>
          <button
            className="back-button"
            onClick={() => navigate('/formlist')}
          >
            목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}

export default FormPage;
