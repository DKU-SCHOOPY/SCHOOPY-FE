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

  // location.state 값은 “숫자면만” 초깃값으로 사용, 아니면 버림
  const initOther = /^\d+$/.test(location.state?.otherUserId)
    ? String(location.state.otherUserId).trim()
    : null;
  const [peerId, setPeerId] = useState(initOther);

  // 메시지에서 상대 학번 계산
  const pickPeerId = (list) => {
    if (!/^\d+$/.test(myId)) return null;
    for (let i = list.length - 1; i >= 0; i--) {
      const s = String(list[i].senderId).trim();
      const r = String(list[i].receiverId).trim();
      if (s === myId && /^\d+$/.test(r)) return r;
      if (r === myId && /^\d+$/.test(s)) return s;
    }
    return null;
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/room/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setMessages(data);

      // 상대 학번 갱신
      const derived = pickPeerId(data);
      if (derived && derived !== peerId) {
        setPeerId(derived);
        console.log("🎯 상대 학번 확정:", derived);
      }
    } catch (err) {
      console.error("채팅 불러오기 실패", err);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!/^\d+$/.test(myId) || !/^\d+$/.test(peerId)) {
      console.error("❌ 학번 포맷 오류", { myId, peerId });
      return;
    }

    let socket = getSocket();

    // 연결 없으면 먼저 연결하고 onopen에서 전송
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("🔌 웹소켓 재연결 시도...", { myId, peerId });
      socket = connectSocket(myId, peerId);
      if (!socket) return; // connect 실패 시 종료

      socket.onopen = () => {
        console.log("✅ 웹소켓 재연결 완료");
        socket.send(JSON.stringify({ message: message.trim(), receiverId: peerId }));
        setMessage("");
        fetchMessages();
      };
      socket.onerror = (e) => console.error("웹소켓 오류", e);
      return;
    }

    // 이미 연결됨
    socket.send(JSON.stringify({ message: message.trim(), receiverId: peerId }));
    setMessage("");
    fetchMessages();
  };

  // 최초 로드 + 폴링
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
    // roomId가 바뀌면 새로 불러옴
  }, [roomId]);

  // 소켓 연결 수립/해제 (peerId 확정 후에만)
  useEffect(() => {
    if (!/^\d+$/.test(myId) || !/^\d+$/.test(peerId)) return;

    const ws = connectSocket(myId, peerId);
    if (!ws) return;

    ws.onopen = () => console.log("✅ 웹소켓 연결됨", { myId, peerId });

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        // 메시지 포맷 방어
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
          {peerId === "32203027" ? "SW융합대학 학생회" : peerId || "-"}
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
