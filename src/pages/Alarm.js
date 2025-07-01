import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Alarm.css";

export default function Alarm() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        //const studentNum = localStorage.getItem("studentNum");
        const res = await axios.get(`${API_BASE_URL}/notice/32193440`);
        // const res = await axios.get(`http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/notice/studentNum=${studentNum}`);
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
      await axios.patch(`${API_BASE_URL}/notice/check/${id}`);
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
      <h2 className="page-title">알림함</h2>
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
              <div className="alarm-title">{noti.title}</div>
              <div className="alarm-message">{noti.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
