import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/event/council/get-event`,
          { eventCode: Number(eventCode) },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data && res.data.eventName && res.data.eventDescription) {
          setFormData({
            eventName: res.data.eventName,
            eventDescription: res.data.eventDescription,
          });
        } else if (res.data.data) {
          setFormData({
            eventName: res.data.data.eventName || "",
            eventDescription: res.data.data.eventDescription || "",
          });
        }
      } catch (err) {
        console.error(err);
        alert("행사 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchEvent();
  }, [eventCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_BASE_URL}/event/council/update-event`,
        {
          eventCode: Number(eventCode),
          eventName: formData.eventName,
          eventDescription: formData.eventDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("수정 완료!");
      navigate(`/eventdetail/${eventCode}`);
    } catch (err) {
      console.error(err);
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 행사를 삭제하시겠습니까?")) return;

    try {
      await axios.post(
        `${API_BASE_URL}/event/council/delete-event`,
        { eventCode: Number(eventCode) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("행사가 삭제되었습니다.");
      navigate("/eventlist");
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="event-title">행사 수정</h1>

      <p className="event-description">
        행사 이름과 설명을 수정한 뒤 저장하세요.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>행사명</label>
          <input
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>설명</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="big-button" style={{ background: "#6a5af9", color: "#fff" }}>
            수정 완료
          </button>
          <button
            type="button"
            className="big-button"
            style={{ background: "#f9d6d5", color: "#c62828" }}
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </form>
    </div>
  );
}
