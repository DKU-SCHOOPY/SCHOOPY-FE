import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from '../config';

const AddSchedule = () => {
  const navigate = useNavigate();
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
    eventImages: [],
    qrCodeImages: []
  });

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      eventImages: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const submitData = new FormData();

    // 날짜 형식 변환 및 데이터 추가
    submitData.append("eventName", formData.eventName);
    submitData.append("department", formData.department);
    submitData.append("surveyStartDate", formData.surveyStartDate.toISOString().slice(0, 10));
    submitData.append("surveyEndDate", formData.surveyEndDate.toISOString().slice(0, 10));
    submitData.append("eventStartDate", formData.eventStartDate.toISOString().slice(0, 10));
    submitData.append("eventEndDate", formData.eventEndDate.toISOString().slice(0, 10));
    submitData.append("maxParticipants", formData.maxParticipants);
    submitData.append("currentParticipants", formData.currentParticipants);
    submitData.append("eventDescription", formData.eventDescription);

    // 이미지 파일들 추가
    formData.eventImages.forEach((file, index) => {
      submitData.append(`eventImages`, file);
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/event/regist-event`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("행사 등록 성공!");
      navigate("/home");
    } catch (err) {
      alert("등록 실패: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="page-title">일정 추가</div>
      <form className="addschedule-form" onSubmit={handleSubmit}>
        
        <div className="addschedule-row">
          <div className="addschedule-col">
            <label className="label">수요 조사 시작일</label>
            <DatePicker
              className="addschedule-datepicker"
              selected={formData.surveyStartDate}
              onChange={(date) => handleDateChange(date, "surveyStartDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일 선택"
              required
            />
          </div>
          <div className="addschedule-col">
            <label className="label">수요 조사 종료일</label>
            <DatePicker
              className="addschedule-datepicker"
              selected={formData.surveyEndDate}
              onChange={(date) => handleDateChange(date, "surveyEndDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일 선택"
              required
            />
          </div>
        </div>

        <div className="addschedule-row">
          <div className="addschedule-col">
            <label className="addschedule-label">행사 시작일</label>
            <DatePicker
              className="addschedule-datepicker"
              selected={formData.eventStartDate}
              onChange={(date) => handleDateChange(date, "eventStartDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일 선택"
              required
            />
          </div>
          <div className="addschedule-col">
            <label className="addschedule-label">행사 종료일</label>
            <DatePicker
              className="addschedule-datepicker"
              selected={formData.eventEndDate}
              onChange={(date) => handleDateChange(date, "eventEndDate")}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일 선택"
              required
            />
          </div>
        </div>

        <label className="addschedule-label">최대 수용 인원</label>
        <input
          className="addschedule-input"
          type="number"
          name="maxParticipants"
          placeholder="최대 수용 인원"
          value={formData.maxParticipants}
          onChange={handleInputChange}
          required
        />

        <label className="addschedule-label">행사 설명</label>
        <textarea
          className="addschedule-textarea"
          name="eventDescription"
          placeholder="행사 설명 입력"
          value={formData.eventDescription}
          onChange={handleInputChange}
        />

        <label className="addschedule-label">이미지 첨부</label>
        <input
          className="addschedule-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <button type="submit" className="addschedule-submit-button">
          등록
        </button>
      </form>
    </div>
  );
};

export default AddSchedule;

// 스타일
const Container = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
`;

const Header = styled.h2`
  text-align: center;
  margin: 32px 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #222;
`;

const FormSection = styled.form`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  margin-top: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  margin-bottom: 0;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  margin-bottom: 0;
  box-sizing: border-box;
  outline: none;
  min-height: 120px;
  resize: vertical;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  margin-bottom: 0;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const Col = styled.div`
  flex: 1;
`;

const BottomButton = styled.button`
  width: 100%;
  padding: 18px 0;
  margin: 40px 0 0 0;
  background: linear-gradient(90deg, #a48cf0 0%, #6c5ce7 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(108,92,231,0.08);
  cursor: pointer;
  transition: background 0.2s;
  &:active {
    background: linear-gradient(90deg, #6c5ce7 0%, #a48cf0 100%);
  }
`;