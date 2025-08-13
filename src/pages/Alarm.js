import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Alarm.css";
import Header from "../components/Header";
import { FiCheck } from "react-icons/fi";

export default function Alarm() {
  const [notifications, setNotifications] = useState([]);
  const studentNum = localStorage.getItem("studentNum");

  useEffect(() => {
    const fetchNotifications = async () => {
      
      
      try {
        const res = await axios.get(`${API_BASE_URL}/notice/${studentNum}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        const data = res.data.map((item) => ({
          id: item.noticeId,
          title: item.title,
          message: item.message,
          read: item.check,
        }));
        setNotifications(data);
        console.log("불러온 데이터",data);
      } catch (err) {
        console.error("알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, []);

  // 읽음 처리 핸들러
  const handleNotificationClick = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/notice/studentNum=${studentNum}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
      setNotifications((prev) =>
        prev.map((noti) =>
          noti.id === id ? { ...noti, read: true } : noti
        )
      );
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }
  };

  return (
    <div className="container">
      <Header title="알림함" showBack/>
      <div className="alarm-list">
        {notifications.length === 0 ? (
          <div className="alarm-empty">알림이 없습니다</div>
        ) : (
          notifications.map((noti) => (
            <div
              key={noti.id}
              className={`alarm-item ${noti.read ? "read" : ""}`}
              onClick={() => handleNotificationClick(noti.id)}
            >
              <FiCheck size={20} className="alarm-icon" />
              <div className="alarm-content">
                <div className="alarm-title">{noti.title}</div>
                <div className="alarm-message">{noti.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
