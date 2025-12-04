import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import "./EditEvent.css";

export default function EditEvent() {
  const { eventCode } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const requestBody = {
        eventCode: Number(eventCode),
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
      };

      const response = await axios.post(
        `${API_BASE_URL}/event/council/update-event`,
        requestBody
      );

      console.log("수정 완료:", response.data);
      alert("행사 정보가 성공적으로 수정되었습니다.");
      navigate(`/event/${eventCode}`);
    } catch (error) {
      console.error("행사 수정 실패:", error);
      alert("행사 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <Header title="행사 정보 수정" showBack />

      <label className="label">게시물 제목</label>
      <input
        type="text"
        className="textarea"
        name="eventName"
        value={formData.eventName}
        onChange={handleChange}
        placeholder="제목을 입력하세요"
        required
      />

      <label className="label">설명</label>
      <textarea
        className="longtext"
        name="eventDescription"
        value={formData.eventDescription}
        onChange={handleChange}
        placeholder="설명을 입력하세요"
        required
      />

      <button type="button" onClick={handleSubmit} className="big-button">
        수정 완료
      </button>
    </div>
  );
}
