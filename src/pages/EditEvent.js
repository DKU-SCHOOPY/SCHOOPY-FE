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
      navigate(`/`);
    } catch (error) {
      console.error("행사 수정 실패:", error);
      alert("행사 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 행사를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/event/council/delete/${eventCode}`);
      alert("행사가 삭제되었습니다.");
      navigate(`/`);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
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

        <div className="button-group">
          <button type="submit" className="btn primary">수정 완료</button>
          <button type="button" onClick={handleDelete} className="btn danger">삭제</button>
        </div>
      </form>
    </div>
  );
}
