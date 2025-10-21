import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Alarm.css";
import Header from "../components/Header";
import { FiCheck, FiInfo } from "react-icons/fi"; // 🔹 아이콘 추가

export default function Alarm() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const role = localStorage.getItem("role");
        const studentNum = localStorage.getItem("studentNum");
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

        const data = (res.data.notices || []).map((item) => ({
          id: item.noticeId,
          sender: item.sender?.name || "알 수 없음",
          title: item.title,
          message: item.message,
          read: item.readCheck,
          type: item.type || null,
        }));
        setNotifications(data);
      } catch (err) {
        console.error("알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleReadAll = async () => {
    try {
      const studentNum = localStorage.getItem("studentNum");
      const role = localStorage.getItem("role");

      await axios.post(
        `${API_BASE_URL}/notice/all/readAll`,
        {
          studentNum,
          isPresident: role === "COUNCIL",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("전체 읽음 처리 실패", err);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/notice/all/read`,
        { noticeId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const notice = res.data.notice;
      if (!notice) return;

      setSelectedNotice({
        id: notice.noticeId,
        sender: notice.sender?.name || "알 수 없음",
        title: notice.title,
        message: notice.message,
        type: notice.type || null,
      });
    } catch (err) {
      console.error("알림 상세 불러오기 실패", err);
    }
  };

  const handleDecision = async (accept) => {
    if (!selectedNotice) return;
    const { id, type } = selectedNotice;

    try {
      let url = "";
      let body = { noticeId: id, accept };

      if (type === "ERequest") {
        url = `${API_BASE_URL}/notice/council/Erequest`;
      } else if (type === "CRequest") {
        url = `${API_BASE_URL}/notice/council/Crequest`;
        body.SW = "SW";
      } else return;

      await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert(`요청이 ${accept ? "승인" : "반려"}되었습니다.`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setSelectedNotice(null);
    } catch (err) {
      console.error("승인/반려 요청 실패", err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleClosePopup = async () => {
    if (!selectedNotice) return;
    const id = selectedNotice.id;

    try {
      await axios.post(
        `${API_BASE_URL}/notice/all/justRead`,
        { noticeId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }

    setSelectedNotice(null);
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
              {/* 🔹 type에 따라 아이콘 변경 */}
              {noti.type === "ERequest" || noti.type === "CRequest" ? (
                <FiInfo size={20} className="alarm-icon info" />
              ) : (
                <FiCheck size={20} className="alarm-icon check" />
              )}
              <div className="alarm-content">
                <div className="alarm-title">{noti.title}</div>
                <div className="alarm-message">{noti.message}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ 팝업 */}
      {selectedNotice && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-title">{selectedNotice.title}</div>
            <div className="popup-sender">보낸 사람: {selectedNotice.sender}</div>
            <div className="popup-message">{selectedNotice.message}</div>

            {selectedNotice.type === "ERequest" ||
            selectedNotice.type === "CRequest" ? (
              <div className="popup-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleDecision(true)}
                >
                  승인
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleDecision(false)}
                >
                  반려
                </button>
              </div>
            ) : (
              <button className="popup-close" onClick={handleClosePopup}>
                확인
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
