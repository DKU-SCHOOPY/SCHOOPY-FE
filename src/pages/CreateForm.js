import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jsQR from "jsqr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateForm.css";

// 질문 타입 상수
const QUESTION_TYPES = {
  SUBJECTIVE: "SUBJECTIVE",
  OBJECTIVE: "MULTIPLE_CHOICE"
};

const AddSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRefs = {
    tossUnpaid: useRef(null),
    tossPaid: useRef(null),
    kakaoUnpaid: useRef(null),
    kakaoPaid: useRef(null)
  };

  const [formData, setFormData] = useState({
    eventName: "",
    department: "",
    surveyStartDate: null,
    surveyEndDate: null,
    eventStartDate: null,
    eventEndDate: null,
    maxParticipants: "",
    currentParticipants: "0",
    eventDescription: "",
    qrCodeImages: {
      qr_toss_x: "",
      qr_toss_o: "",
      qr_kakaopay_x: "",
      qr_kakaopay_o: ""
    }
  });

  // ====== 폼 생성용 상태 및 함수 ======
  const [questions, setQuestions] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState(QUESTION_TYPES.SUBJECTIVE);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        eventName: location.state.eventName || "",
        department: location.state.department || "",
        eventDescription: location.state.eventDescription || ""
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleQrImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setFormData(prev => ({
              ...prev,
              qrCodeImages: {
                ...prev.qrCodeImages,
                [type]: code.data
              }
            }));
            alert(`${type} QR 코드가 인식되었습니다: ${code.data}`);
          } else {
            alert('QR 코드를 인식할 수 없습니다. 다른 이미지를 시도해주세요.');
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.surveyStartDate || !formData.surveyEndDate) {
      alert("수요 조사 시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (!formData.eventStartDate || !formData.eventEndDate) {
      alert("행사 시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      alert("최대 수용 인원을 입력해주세요.");
      return;
    }

    // 환경변수로 분기
    const isDummy = process.env.REACT_APP_USE_DUMMY === "true";

    if (isDummy) {
      // 더미 응답
      const response = { data: { code: "SU", message: "더미 성공" } };
      if (response.data.code === "SU") {
        alert("행사가 성공적으로 등록되었습니다! (더미)");
        navigate("/formlist");
      } else {
        alert("행사 등록에 실패했습니다: " + response.data.message);
      }
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("eventName", formData.eventName);
      submitData.append("department", formData.department);
      submitData.append("surveyStartDate", formData.surveyStartDate.toISOString().slice(0, 10));
      submitData.append("surveyEndDate", formData.surveyEndDate.toISOString().slice(0, 10));
      submitData.append("eventStartDate", formData.eventStartDate.toISOString().slice(0, 10));
      submitData.append("eventEndDate", formData.eventEndDate.toISOString().slice(0, 10));
      submitData.append("maxParticipants", formData.maxParticipants);
      submitData.append("currentParticipants", "0");
      submitData.append("eventDescription", formData.eventDescription);

      // QR 코드 이미지 추가
      Object.entries(formData.qrCodeImages).forEach(([type, url]) => {
        if (url) {
          submitData.append(type, url);
        }
      });

      // 질문 데이터 추가
      questions.forEach((question, index) => {
        submitData.append(`question[${index}].questionText`, question.question);
        submitData.append(`question[${index}].questionType`, question.type);
        submitData.append(`question[${index}].isRequired`, question.required);
        submitData.append(`question[${index}].isMultiple`, question.multiple);

        if (question.type === QUESTION_TYPES.OBJECTIVE && question.options.length > 0) {
          question.options.forEach((choice, choiceIndex) => {
            if (choice.trim()) {
              submitData.append(`question[${index}].choices[${choiceIndex}]`, choice);
            }
          });
        }
      });

      const response = await axios.post(
        "http://localhost:8080/schoopy/v1/event/regist-event",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.code === "SU") {
        alert("행사가 성공적으로 등록되었습니다!");
        navigate("/formlist");
      } else {
        alert("행사 등록에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("행사 등록 중 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>
      <form className="form" onSubmit={handleFormSubmit}>
        <h2 className="page-title">폼 생성</h2>

        {/* ====== 질문 ====== */}
        <div className="question-section">
          <h3 className="question-section-title">질문</h3>
          <div className="question-add-row">
            <select value={newQuestionType} onChange={e => setNewQuestionType(e.target.value)} className="question-input" style={{ maxWidth: 120 }}>
              <option value={QUESTION_TYPES.SUBJECTIVE}>주관식</option>
              <option value={QUESTION_TYPES.OBJECTIVE}>객관식</option>
            </select>
            <button type="button" className="question-action-btn" onClick={handleAddQuestion}>질문 추가</button>
          </div>
          <div>
            {questions.map((q, idx) => (
              <div key={q.id} className="question-card">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{idx + 1}.</span>
                  <input
                    type="text"
                    placeholder="질문을 입력하세요"
                    value={q.question}
                    onChange={e => handleQuestionChange(q.id, "question", e.target.value)}
                    className="question-input"
                  />
                  <label className="question-label">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={e => handleQuestionChange(q.id, "required", e.target.checked)}
                    /> 필수
                  </label>
                  <button type="button" className="question-action-btn" onClick={() => handleDeleteQuestion(q.id)} style={{ color: "#e74c3c" }}>삭제</button>
                </div>
                {q.type === QUESTION_TYPES.OBJECTIVE && (
                  <div style={{ marginTop: 8, marginLeft: 24 }}>
                    <label className="question-label">
                      <input
                        type="checkbox"
                        checked={q.multiple}
                        onChange={e => handleQuestionChange(q.id, "multiple", e.target.checked)}
                      /> 복수 선택 허용
                    </label>
                    <div>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="question-option-row">
                          <input
                            type="text"
                            placeholder={`선택지 ${optIdx + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(q.id, optIdx, e.target.value)}
                            className="question-option-input"
                          />
                          <button type="button" className="question-action-btn" onClick={() => handleDeleteOption(q.id, optIdx)} disabled={q.options.length <= 2} style={{ color: "#e74c3c" }}>삭제</button>
                        </div>
                      ))}
                      <button type="button" className="question-action-btn" onClick={() => handleAddOption(q.id)} style={{ marginTop: 4 }}>선택지 추가</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr style={{ margin: '32px 0 24px 0', border: 'none', borderTop: '1.5px solid #e0e0e0' }} />

        {/* ====== 수요조사 시작/종료일 ====== */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label">수요 조사 시작일</label>
            <DatePicker
              className="textarea"
              selected={formData.surveyStartDate}
              onChange={(date) => handleDateChange(date, "surveyStartDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일 선택"
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">수요 조사 종료일</label>
            <DatePicker
              className="textarea"
              selected={formData.surveyEndDate}
              onChange={(date) => handleDateChange(date, "surveyEndDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일 선택"
              required
            />
          </div>
        </div>

        {/* ====== 행사 시작/종료일 ====== */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label">행사 시작일</label>
            <div>
              <DatePicker
                className="textarea"
                selected={formData.eventStartDate}
                onChange={(date) => handleDateChange(date, "eventStartDate")}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작일 선택"
                required
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">행사 종료일</label>
            <div>
              <DatePicker
                className="textarea"
                selected={formData.eventEndDate}
                onChange={(date) => handleDateChange(date, "eventEndDate")}
                dateFormat="yyyy-MM-dd"
                placeholderText="종료일 선택"
                required
              />
            </div>
          </div>
        </div>

        {/* ====== 최대 수용 인원 ====== */}
        <div style={{ marginBottom: 24 }}>
          <label className="label">최대 수용 인원</label>
          <input
            className="textarea"
            type="number"
            name="maxParticipants"
            placeholder="최대 수용 인원"
            value={formData.maxParticipants}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* ====== QR 추가 버튼 ====== */}
        <div style={{ margin: '32px 0 24px 0', textAlign: 'center' }}>
          <button type="button" className="question-action-btn" style={{ fontSize: 15, padding: '10px 32px' }} onClick={() => setQrModalOpen(true)}>
            QR 추가
          </button>
        </div>

        <button className="big-button" type="submit">등록하기</button>
      </form>

      {/* ====== QR 업로드 모달 ====== */}
      {qrModalOpen && (
        <div className="qr-modal-backdrop" onClick={() => setQrModalOpen(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: '#6a5af9' }}>QR 업로드</h3>
              <button onClick={() => setQrModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6a5af9' }}>×</button>
            </div>
            <div className="qr-section">
              <div className="qr-upload-row">
                <div className="qr-upload-container">
                  <label className="label">토스 미입금자 QR</label>
                  <button
                    className="qr-upload-button"
                    type="button"
                    onClick={() => fileInputRefs.tossUnpaid.current.click()}
                  >QR 업로드</button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRefs.tossUnpaid}
                    onChange={e => handleQrImageUpload("qr_toss_x", e)}
                  />
                  {formData.qrCodeImages.qr_toss_x && (
                    <div className="qr-url-text">{formData.qrCodeImages.qr_toss_x}</div>
                  )}
                </div>
                <div className="qr-upload-container">
                  <label className="label">토스 입금자 QR</label>
                  <button
                    className="qr-upload-button"
                    type="button"
                    onClick={() => fileInputRefs.tossPaid.current.click()}
                  >QR 업로드</button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRefs.tossPaid}
                    onChange={e => handleQrImageUpload("qr_toss_o", e)}
                  />
                  {formData.qrCodeImages.qr_toss_o && (
                    <div className="qr-url-text">{formData.qrCodeImages.qr_toss_o}</div>
                  )}
                </div>
              </div>
              <div className="qr-upload-row">
                <div className="qr-upload-container">
                  <label className="label">카카오페이 미입금자 QR</label>
                  <button
                    className="qr-upload-button"
                    type="button"
                    onClick={() => fileInputRefs.kakaoUnpaid.current.click()}
                  >QR 업로드</button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRefs.kakaoUnpaid}
                    onChange={e => handleQrImageUpload("qr_kakaopay_x", e)}
                  />
                  {formData.qrCodeImages.qr_kakaopay_x && (
                    <div className="qr-url-text">{formData.qrCodeImages.qr_kakaopay_x}</div>
                  )}
                </div>
                <div className="qr-upload-container">
                  <label className="label">카카오페이 입금자 QR</label>
                  <button
                    className="qr-upload-button"
                    type="button"
                    onClick={() => fileInputRefs.kakaoPaid.current.click()}
                  >QR 업로드</button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRefs.kakaoPaid}
                    onChange={e => handleQrImageUpload("qr_kakaopay_o", e)}
                  />
                  {formData.qrCodeImages.qr_kakaopay_o && (
                    <div className="qr-url-text">{formData.qrCodeImages.qr_kakaopay_o}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSchedule;
