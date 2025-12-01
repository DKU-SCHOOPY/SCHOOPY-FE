import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="edit-event-container">
      <h2>행사 정보 수정</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label>행사 이름</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="새로운 행사 이름을 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label>행사 설명</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            placeholder="새로운 행사 설명을 입력하세요"
            rows={5}
            required
          />
        </div>

        <button type="submit" className="save-button">
          수정 완료
        </button>
      </form>
    </div>
  );
}
