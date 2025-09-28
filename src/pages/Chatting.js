import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./Chatting.css";
import { connectSocket, getSocket, closeSocket } from "../socket";

function Chatting() {
  const location = useLocation();
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // 내 학번
  const myId = String(localStorage.getItem("studentNum") || "").trim();

  // 이전 페이지에서 전달받은 상대 학번, 이름
  const peerId = String(location.state?.otherUserId || "").trim();
  const peerName = location.state?.otherUserName || "";

  const fetchMessages = async () => {
    if (!roomId) return; // roomId 없으면 불러오기 API 안 호출

    try {
      const res = await axios.get(`${API_BASE_URL}/chat/room/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setMessages(data);
    } catch (err) {
      console.error("채팅 불러오기 실패", err);
    }
  };



  const sendMessage = () => {
    if (!message.trim()) return;

    let socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      socket = connectSocket(myId, peerId);
      if (!socket) return;

      socket.onopen = () => {
        socket.send(JSON.stringify({ message: message.trim(), receiverId: peerId }));
        setMessage("");
      };
      return;
    }

    socket.send(JSON.stringify({ message: message.trim(), receiverId: peerId }));
    setMessage("");
  };



  // 최초 로드 + 폴링
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  // 소켓 연결
  useEffect(() => {
    if (!/^\d+$/.test(myId) || !/^\d+$/.test(peerId)) return;

    const ws = connectSocket(myId, peerId);
    if (!ws) return;

    ws.onopen = () => console.log("✅ 웹소켓 연결됨", { myId, peerId });

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg && (msg.message || msg.content)) {
          setMessages((prev) => [
            ...prev,
            {
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              content: msg.message ?? msg.content,
            },
          ]);
        }
      } catch (err) {
        console.error("메시지 파싱 실패", err);
      }
    };

    ws.onclose = () => console.log("ℹ️ 웹소켓 종료");
    ws.onerror = (e) => console.error("웹소켓 오류", e);

    return () => closeSocket();
  }, [myId, peerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatting-container">
      <div className="chatting-header">
        <button className="chatting-back-button" onClick={() => window.history.back()}>
          〈
        </button>
        <span className="chatting-title">
          {peerName || "-"}
        </span>
      </div>

      <div className="chatting-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatting-message ${
              String(msg.senderId) === myId ? "me" : "other"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatting-input-box">
        <input
          type="text"
          placeholder="내용을 입력하세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          ✈
        </button>
      </div>
    </div>
  );
}

export default Chatting;
