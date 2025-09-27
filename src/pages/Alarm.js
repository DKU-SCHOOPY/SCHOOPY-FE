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
      const role = localStorage.getItem("role");
      const studentNum = localStorage.getItem("studentNum");

      // role에 따라 요청 URL 변경
      const url =
        role === "COUNCIL"
          ? `${API_BASE_URL}/notice/council/check`
          : `${API_BASE_URL}/notice/student/check`;

      const res = await axios.post(
        url,
        { studentNum },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("res", res.data);

        const data = (res.data.notices || []).map((item) => ({
          id: item.noticeId,
          sender: item.sender?.name || "알 수 없음",
          title: item.title,
          message: item.message,
          read: item.readCheck,
        }));
        setNotifications(data);
        console.log("불러온 데이터",data);
      } catch (err) {
        console.error("알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, []);


  // 전체 읽음 처리
  const handleReadAll = async () => {
    try {
      const studentNum = localStorage.getItem("studentNum");
      const role = localStorage.getItem("role");

      const res = await axios.post(
        `${API_BASE_URL}/notice/all/readAll`,
        {
          studentNum,
          isPresident: role === "COUNCIL", // 학생회면 true
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("전체 읽음 응답", res.data);

      // 전체 읽음 상태로 업데이트
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, read: true }))
      );
    } catch (err) {
      console.error("전체 읽음 처리 실패", err);
    }
  };


  // 하나 읽음 처리
const handleNotificationClick = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/notice/all/justRead`,
      { noticeId: id }, // body에 noticeId 전달
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("읽음 처리 응답", response.data);
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
      <Header title="알림함" showBack>
      <button className="read-all-btn" onClick={handleReadAll}>
        전체 읽음
      </button>
      </Header>

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
