import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Form.css"; // 분리된 CSS 파일 불러오기

// 질문 타입 상수
const QUESTION_TYPES = {
  SUBJECTIVE: "subjective",
  OBJECTIVE: "objective"
};

const Form = () => {
  const navigate = useNavigate();
  const { eventCode } = useParams();

  console.log("Current URL params:", useParams()); // 전체 URL 파라미터 확인
  console.log("URL eventCode:", eventCode); // eventCode 값 확인

  const [formData, setFormData] = useState({
    isStudent: false,
    councilFeePaid: false,
    isPaymentCompleted: false
  });

  const [eventData, setEventData] = useState(null);
  const [errors, setErrors] = useState({});
  const [studentNum] = useState("32220573"); // 하드코딩된 studentNum

  // ====== 폼 생성용 상태 및 함수 ======
  const [questions, setQuestions] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState(QUESTION_TYPES.SUBJECTIVE);

  // 질문 추가
  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        type: newQuestionType,
        question: "",
        required: false,
        multiple: false, // 객관식만 의미 있음
        options: newQuestionType === QUESTION_TYPES.OBJECTIVE ? ["", ""] : []
      }
    ]);
  };

  // 질문 삭제
  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // 질문 텍스트/옵션/필수/복수 선택 변경
  const handleQuestionChange = (id, field, value) => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  // 객관식 옵션 변경
  const handleOptionChange = (qid, idx, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const newOptions = [...q.options];
      newOptions[idx] = value;
      return { ...q, options: newOptions };
    }));
  };

  // 객관식 옵션 추가
  const handleAddOption = (qid) => {
    setQuestions(prev => prev.map(q =>
      q.id === qid ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  // 객관식 옵션 삭제
  const handleDeleteOption = (qid, idx) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const newOptions = q.options.filter((_, i) => i !== idx);
      return { ...q, options: newOptions };
    }));
  };

  // ====== 폼 생성 UI ======

  // useEffect(() => {
  //   // 행사 정보 조회
  //   const fetchEventData = async () => {
  //     if (!eventCode) {
  //       console.error("No eventCode found in URL");
  //       return;
  //     }

  //     try {
  //       console.log("Fetching event data for code:", eventCode);
  //       const response = await axios.get(
  //         `${API_BASE_URL}/event/${eventCode}`
  //       );
  //       if (response.data.statusCode === "OK") {
  //         console.log("Event Data:", response.data.data);
  //         setEventData(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching event data:", error);
  //     }
  //   };

  //   fetchEventData();
  // }, [eventCode]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // const handlePayment = async (remitType) => {
  //   try {
  //     // remitType을 대문자로 변환
  //     const formattedRemitType = remitType === "toss" ? "TOSS" : "KAKAOPAY";

  //     const requestData = {
  //       studentNum: studentNum,
  //       eventCode: parseInt(eventCode),
  //       remitType: formattedRemitType
  //     };

  //     console.log("Payment Request Data:", requestData); // 요청 데이터 로깅

  //     const response = await axios.post(
  //       `${API_BASE_URL}/event/remit-redirect`,
  //       requestData
  //     );

  //     console.log("Payment Response:", response.data);

  //     if (response.data.statusCode === "OK" && response.data.body.url) {

  //       const paymentUrl = response.data.body.url;

  //       // 토스든 카카오페이든 API에서 받은 URL을 새 탭에서 엽니다.
  //       // API 응답 URL이 웹/앱 환경을 모두 처리하도록 설계되어 있어야 합니다.
  //       //window.open(paymentUrl, '_blank');
  //       const deeplink = paymentUrl.replace("https://qr.kakaopay.com/", "kakaotalk://kakaopay/money/to/qr?qr_code=");

  //       window.location.href = deeplink;
  //       //const go = window.confirm("카카오톡으로 이동할까요?");

  //       // 딥링크 처리는 API 응답 URL 자체에 포함되어 있거나
  //       // API 호출 전에 환경을 판단하여 다른 API를 호출하는 방식으로 구현될 수 있습니다.
  //       // 현재는 API 응답 URL을 직접 엽니다.

  //       setFormData(prev => ({
  //         ...prev,
  //         councilFeePaid: true
  //       }));
  //     } else {
  //       console.error("Invalid response format:", response.data);
  //       alert("송금 URL을 가져오는데 실패했습니다.");
  //     }
  //   } catch (error) {
  //     console.error("Error getting payment URL:", error.response || error);
  //     alert("송금 URL을 가져오는데 실패했습니다: " + (error.response?.data?.message || error.message));
  //   }
  // };

  const handlePayment = async (remitType) => {
    try {
      const formattedRemitType = remitType === "toss" ? "TOSS" : "KAKAOPAY";

      const requestData = {
        studentNum: studentNum,
        eventCode: parseInt(eventCode),
        remitType: formattedRemitType
      };

      const response = await axios.post(
        `${API_BASE_URL}/event/remit-redirect`,
        requestData
      );

      if (response.data.statusCode === "OK" && response.data.body.url) {
        const paymentUrl = response.data.body.url;

        if (remitType === "toss") {
          // 토스 링크 처리
          if (paymentUrl.startsWith("supertoss://") || paymentUrl.startsWith("https://toss.me/")) {
            window.location.href = paymentUrl;
          } else {
            alert("유효한 토스 송금 링크가 아닙니다.");
          }
        } else if (remitType === "kakaopay") {
          // 카카오페이 링크 → 딥링크 변환
          const deeplink = paymentUrl.replace(
            "https://qr.kakaopay.com/",
            "kakaotalk://kakaopay/money/to/qr?qr_code="
          );
          window.location.href = deeplink;
        }

        // 송금 상태 저장
        setFormData(prev => ({
          ...prev,
          councilFeePaid: true
        }));

      } else {
        alert("송금 URL을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      alert("송금 URL을 가져오는데 실패했습니다: " + (error.response?.data?.message || error.message));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/event/application`,
        {
          studentNum: studentNum,
          eventCode: parseInt(eventCode),
          isStudent: false,
          councilFeePaid: false,
          isPaymentCompleted: false
        }
      );
      console.log("신청하기", response.data.statusCode);

      if (response.data.statusCode === "OK") {
        alert("신청이 완료되었습니다!");
        navigate("/home");
      } else {
        alert("신청에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("신청 중 오류가 발생했습니다: " + error.message);
    }
  };

  // QR 코드가 있는지 확인하는 함수
  const hasQrCode = () => {
    if (!eventData) return false;
    return eventData.qr_toss_x || eventData.qr_kakaopay_x;
  };

  return (
    <div className="container">
      <h2 className="page-title">폼 생성</h2>
      <div className="form-create-section">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={newQuestionType} onChange={e => setNewQuestionType(e.target.value)}>
            <option value={QUESTION_TYPES.SUBJECTIVE}>주관식</option>
            <option value={QUESTION_TYPES.OBJECTIVE}>객관식</option>
          </select>
          <button type="button" onClick={handleAddQuestion}>질문 추가</button>
        </div>
        <div style={{ marginTop: 16 }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="question-card" style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="질문을 입력하세요"
                  value={q.question}
                  onChange={e => handleQuestionChange(q.id, "question", e.target.value)}
                  style={{ flex: 1 }}
                />
                <label style={{ marginLeft: 8 }}>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={e => handleQuestionChange(q.id, "required", e.target.checked)}
                  /> 필수
                </label>
                <button type="button" onClick={() => handleDeleteQuestion(q.id)} style={{ color: "red", marginLeft: 8 }}>삭제</button>
              </div>
              {q.type === QUESTION_TYPES.OBJECTIVE && (
                <div style={{ marginTop: 8, marginLeft: 24 }}>
                  <label style={{ marginRight: 8 }}>
                    <input
                      type="checkbox"
                      checked={q.multiple}
                      onChange={e => handleQuestionChange(q.id, "multiple", e.target.checked)}
                    /> 복수 선택 허용
                  </label>
                  <div>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                        <input
                          type="text"
                          placeholder={`선택지 ${optIdx + 1}`}
                          value={opt}
                          onChange={e => handleOptionChange(q.id, optIdx, e.target.value)}
                          style={{ marginRight: 4 }}
                        />
                        <button type="button" onClick={() => handleDeleteOption(q.id, optIdx)} disabled={q.options.length <= 2} style={{ color: "red" }}>삭제</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddOption(q.id)} style={{ marginTop: 4 }}>선택지 추가</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* 기존 행사 신청 폼 */}
      <h2 className="page-title">행사 신청</h2>
      <p className="form-description">아래 항목을 작성하여 신청해 주세요.</p>

      <form onSubmit={handleSubmit}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isStudent"
            checked={formData.isStudent}
            onChange={handleInputChange}
          />
          재학생입니다
        </label>

        <div className="button-group">
          <button
            type="button"
            className={`payment-button toss ${formData.councilFeePaid ? "disabled" : ""}`}
            onClick={() => handlePayment("toss")}
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "토스로 송금하기"}
          </button>

          <button
            type="button"
            className={`payment-button kakao ${formData.councilFeePaid ? "disabled" : ""}`}
            onClick={() => handlePayment("kakaopay")}
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "카카오페이로 송금하기"}
          </button>
        </div>

        <button
          type="submit"
          className="big-button"
          disabled={!formData.councilFeePaid}
        >
          {formData.councilFeePaid ? "신청하기" : "송금 후 신청 가능"}
        </button>
      </form>
    </div>
  );
};

export default Form;
