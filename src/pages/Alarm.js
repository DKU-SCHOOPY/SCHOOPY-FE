import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Alarm.css";
import Header from "../components/Header";
import { FiCheck } from "react-icons/fi";

export default function Alarm() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null); // ✅ 팝업용 선택 알림
  const studentNum = localStorage.getItem("studentNum");

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
        }));
        setNotifications(data);
      } catch (err) {
        console.error("알림 불러오기 실패", err);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ 전체 읽음 처리
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

      setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
    } catch (err) {
      console.error("전체 읽음 처리 실패", err);
    }
  };

  // ✅ 알림 클릭 시: 팝업 먼저 띄우기
const handleNotificationClick = async (id) => {
  try {
    // 상세 내용 조회
    const res = await axios.post(
      `${API_BASE_URL}/notice/all/read`,
      { noticeId: id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("알림 상세 응답", res.data);

    const notice = res.data.notice;
    if (!notice) return;

    // ✅ 팝업에 보여줄 데이터 저장
    setSelectedNotice({
      id: notice.noticeId,
      sender: notice.sender?.name || "알 수 없음",
      title: notice.title,
      message: notice.message,
    });

    // 팝업 닫을 때 읽음 처리 실행됨
  } catch (err) {
    console.error("알림 상세 불러오기 실패", err);
  }
};


  // ✅ 팝업 닫기 + 읽음 처리
  const handleClosePopup = async () => {
    if (!selectedNotice) return;
    const id = selectedNotice.id;

    try {
      // 기존 읽음 처리 기능 호출
      const response = await axios.post(
        `${API_BASE_URL}/notice/all/justRead`,
        { noticeId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("읽음 처리 응답", response.data);

      // 로컬 상태 업데이트
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }

    setSelectedNotice(null); // 팝업 닫기
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

      {/* ✅ 알림 팝업 */}
      {selectedNotice && (
        <div className="popup-overlay">
          <div className="popup">
            <h3 className="popup-title">{selectedNotice.title}</h3>
            <p className="popup-sender">보낸 사람: {selectedNotice.sender}</p>
            <p className="popup-message">{selectedNotice.message}</p>
            <button className="popup-close" onClick={handleClosePopup}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
