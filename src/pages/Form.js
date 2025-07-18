
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Form.css";

function FormPage() {
  const { eventCode } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentNum, setStudentNum] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [councilFeePaid, setCouncilFeePaid] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/schoopy/v1/event/get-form/${eventCode}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      });
  }, [eventCode]);

  if (loading) return <div>로딩중...</div>;
  if (!form) return <div>폼 정보를 불러올 수 없습니다.</div>;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // 송금 버튼 클릭 시
  const handlePayment = (remitType) => {
    // 실제 송금 로직은 API 명세에 맞게 구현
    setCouncilFeePaid(true);
    alert(remitType + " 송금 완료(모의)");
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
      eventCode: form.formId,
      isStudent,
      answer: answerArr
    };

    const res = await axios.post(
      "http://localhost:8080/schoopy/v1/event/application",
      payload
    );
    alert(res.data.message);
  };

  // 송금 QR URL이 있는지 확인
  const hasRemitQR = !!(form.qr_toss_x || form.qr_kakaopay_x);

  return (
    <div className="container">
      <h2 className="page-title">행사 신청</h2>
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
                  <div>
                    {q.choices.map(opt => (
                      <label key={opt} style={{ marginRight: 16 }}>
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
                        {opt}
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

        {/* 재학생 여부 */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isStudent}
              onChange={e => setIsStudent(e.target.checked)}
            />
            재학생입니다
          </label>
        </div>

        {/* 송금 버튼/신청 버튼 조건부 렌더링 */}
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
    </div>
  );
}

export default FormPage;
