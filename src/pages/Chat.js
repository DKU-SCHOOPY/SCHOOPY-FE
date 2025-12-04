import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Chat.css";

// 한국 시간으로 날짜 포맷팅 (2025-12-04 15:14 형식)
function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function ChatRoomList() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const currentUser = { userId: localStorage.getItem("studentNum") }; // 임시 userId
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!currentUser || !currentUser.userId) return;
    const studentId = parseInt(currentUser.userId);

    const url =
      role === "COUNCIL"
        ? `${API_BASE_URL}/chat/council/rooms/${studentId}`
        : `${API_BASE_URL}/chat/student/contacts/${studentId}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (role === "COUNCIL" && Array.isArray(res.data)) {
          setChats(res.data);
        } else if (role === "STUDENT" && res.data && Array.isArray(res.data.contacts)) {
          setChats(res.data.contacts);
        } else {
          console.warn("채팅방 응답이 예상과 다름:", res.data);
          setChats([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setChats([]); // 에러 시에도 빈 배열 세팅
      });
  }, []);

  // 검색 기준도 role 따라 다르게
  const filteredChats = chats.filter((chat) => {
    if (role === "COUNCIL") {
      return (chat.counterpartName || "")
        .toLowerCase()
        .includes((search || "").toLowerCase());
    } else {
      return (chat.department || "")
        .toLowerCase()
        .includes((search || "").toLowerCase());
    }
  });

  return (
    <div className="container">
      <h2 className="page-title">채팅</h2>

      <div className="searchbox">
        <input
          className="searchinput"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chat-list">
        {filteredChats.map((chat) =>
          role === "COUNCIL" ? (
            <Link
              key={chat.roomId}
              to={`/chat/room/${chat.roomId}`}
              state={{
                otherUserId: chat.counterpartId,
                otherUserName: chat.counterpartName,
                roomId: chat.roomId,
              }}
            >
              <div className="chat-item">
                <FaUserCircle className="chat-avatar" />
                <div className="chat-info">
                  <div className="chat-name-row">
                    <div className="chat-name">{chat.counterpartName}</div>
                    {chat.lastMessageAt && (
                      <div className="chat-time">{formatDateTime(chat.lastMessageAt)}</div>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              key={chat.roomId}
              to={`/chat/room/${chat.roomId}`}
              state={{
                otherUserId: chat.presidentStudentNum,
                otherUserName: chat.department,
                roomId: chat.roomId,
              }}
            >
              <div className="chat-item">
                <FaUserCircle className="chat-avatar" />
                <div className="chat-info">
                  <div className="chat-name-row">
                    <div className="chat-name">{chat.department}</div>
                    {chat.lastMessageAt && (
                      <div className="chat-time">{formatDateTime(chat.lastMessageAt)}</div>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  )}
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default ChatRoomList;
