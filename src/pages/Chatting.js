// Chatting.js
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./Chatting.css";

function Chatting() {
  const location = useLocation();
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState(location.state?.otherUserId || null);

  const currentUser = { userId: "32203027" }; // 실제론 useSelector 등으로 유저 정보 가져오기

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://ec2-3-37-86-181.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/chat/room/${roomId}`
      );
      setMessages(res.data);

      if (res.data.length > 0 && !customerId) {
        const lastMsg = res.data[res.data.length - 1];
        const otherId =
          lastMsg.senderId.toString() === currentUser.userId
            ? lastMsg.receiverId
            : lastMsg.senderId;
        setCustomerId(otherId);
      }
    } catch (err) {
      console.error("채팅 불러오기 실패", err);
    }
  };

  const sendMessage = async () => {
    if (!message || !customerId) return;

    try {
      await axios.post(
        "http://ec2-3-37-86-181.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/chat/message",
        {
          senderId: currentUser.userId,
          receiverId: customerId,
          message,
        }
      );
      setMessage("");
      fetchMessages(); // 전송 후 즉시 새로고침
    } catch (err) {
      console.error("메시지 전송 실패", err);
    }
  };

  // 채팅방 입장 시 메시지 로딩 + 3초마다 새로고침
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // 3초마다 새 메시지 확인
    return () => clearInterval(interval);
  }, [roomId]);

  // 스크롤 자동 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatting-container">
      <div className="chatting-header">
        <button onClick={() => window.history.back()} className="back-button">
          ←
        </button>
        <span className="chatting-title">{customerId}</span>
      </div>

      <div className="chatting-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatting-message ${
              msg.senderId.toString() === currentUser.userId ? "me" : "other"
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
