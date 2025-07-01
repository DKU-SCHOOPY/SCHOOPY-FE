import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jsQR from "jsqr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateForm.css";

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

      Object.entries(formData.qrCodeImages).forEach(([type, url]) => {
        if (url) {
          submitData.append(type, url);
        }
      });

      const response = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
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

        <label className="label">수요 조사 시작일</label>
        <DatePicker
          className="textarea"
          selected={formData.surveyStartDate}
          onChange={(date) => handleDateChange(date, "surveyStartDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          required
        />

        <label className="label">수요 조사 종료일</label>
        <DatePicker
          className="textarea"
          selected={formData.surveyEndDate}
          onChange={(date) => handleDateChange(date, "surveyEndDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          required
        />

        <label className="label">행사 시작일</label>
        <DatePicker
          className="textarea"
          selected={formData.eventStartDate}
          onChange={(date) => handleDateChange(date, "eventStartDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          required
        />

        <label className="label">행사 종료일</label>
        <DatePicker
          className="textarea"
          selected={formData.eventEndDate}
          onChange={(date) => handleDateChange(date, "eventEndDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          required
        />

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

        <div className="qr-section">
          {['tossUnpaid', 'tossPaid', 'kakaoUnpaid', 'kakaoPaid'].map(key => (
            <div className="qr-upload-container" key={key}>
              <label className="label">{key.includes('toss') ? '토스' : '카카오페이'} {key.includes('Unpaid') ? '미입금자' : '입금자'} QR</label>
              <button
                className="qr-upload-button"
                type="button"
                onClick={() => fileInputRefs[key].current?.click()}
              >
                QR코드 업로드
              </button>
              <input
                type="file"
                ref={fileInputRefs[key]}
                onChange={(e) => handleQrImageUpload(`qr_${key.replace('Unpaid', '_x').replace('Paid', '_o')}`, e)}
                accept="image/*"
                style={{ display: "none" }}
              />
              {formData.qrCodeImages[`qr_${key.replace('Unpaid', '_x').replace('Paid', '_o')}`] && (
                <div className="qr-url-text">
                  인식된 URL: {formData.qrCodeImages[`qr_${key.replace('Unpaid', '_x').replace('Paid', '_o')}`]}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="big-button" type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default AddSchedule;
