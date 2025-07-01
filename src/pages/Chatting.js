import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Chatting.css";
import { connectSocket, getSocket, closeSocket } from "../socket"; // socket 모듈 import

function Chatting() {
  const location = useLocation();
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState(location.state?.otherUserId || null);

  const currentUser = { userId: localStorage.getItem("studentNum") }; // 실제론 useSelector 등으로 유저 정보 가져오기

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/room/${roomId}`);
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

  const sendMessage = () => {
  if (!message || !customerId) return;

  let socket = getSocket();

  // 연결 안 돼있으면 연결
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = connectSocket(currentUser.userId, customerId);
    console.log("웹소켓 재연결 시도 중...");
    socket.onopen = () => {
      console.log("웹소켓 재연결 완료");
      socket.send(JSON.stringify({ message, receiverId: customerId }));
      fetchMessages(); // 전송 후 새로고침
    };
    return;
  }

  // 정상 연결 상태
  socket.send(JSON.stringify({ message, receiverId: customerId }));
  setMessage("");
  fetchMessages();
};


  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    if (!customerId) return;

    const ws = connectSocket(currentUser.userId, customerId);
    ws.onopen = () => {
      console.log("웹소켓 연결됨");
    };
    ws.onmessage = (e) => {
  console.log("받은 메시지:", e.data);
  const newMessage = JSON.parse(e.data);

  // 메시지 내용이 유효할 경우에만 추가
  if (newMessage && newMessage.message) {
    setMessages(prev => [...prev, {
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.message
    }]);
  }
};

    ws.onclose = () => {
      console.log("웹소켓 연결 종료");
    };

    return () => closeSocket();
  }, [customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  return (
    <div className="chatting-container">
      <div className="chatting-header">
        <button onClick={() => window.history.back()} className="back-button">←</button>
        <span className="chatting-title"></span>
          {customerId === "32203027" ? "SW융합대학 학생회" : customerId}
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
        <button className="send-button" onClick={sendMessage}>✈</button>
      </div>
    </div>
  );
}

export default Chatting;
