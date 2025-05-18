import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Stomp } from "@stomp/stompjs";
import './Chatting.css';

function Chatting() {
  // URL에서 채팅방 ID를 가져옴
  const { roomId } = useParams();
  // 채팅 메시지 상태
  const [messages, setMessages] = useState([]);
  // 메시지 입력 상태
  const [message, setMessage] = useState("");
  // STOMP 클라이언트를 위한 ref. 웹소켓 연결을 유지하기 위해 사용
  const stompClient = useRef(null);
  // Redux store에서 현재 사용자 정보 가져오기
  //const currentUser = { userSeq: 1, userId: "testuser" };
  const currentUser = useSelector((state) => state.user);
  // 채팅 메시지 목록의 끝을 참조하는 ref. 이를 이용해 새 메시지가 추가될 때 스크롤을 이동
  const messagesEndRef = useRef(null);
  // 컴포넌트 마운트 시 실행. 웹소켓 연결 및 초기 메시지 로딩
  const [profileImg, setProfileImg] = useState(null);
  const [customerSeq, setCustomerSeq] = useState("");

  useEffect(() => {
    connect();
    fetchMessages();
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => disconnect();
  }, [roomId]);
  // 메시지 목록이 업데이트될 때마다 스크롤을 최하단으로 이동시키는 함수
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // 웹소켓 연결 설정
  const connect = () => {
    const socket = new WebSocket("ws://localhost:80/ws");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (newMessage.senderSeq !== currentUser.userSeq) {
          setCustomerSeq(newMessage.senderSeq);
        }
      });
    });
    console.log("방 번호", roomId);
  };
  // 웹소켓 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };
  // 기존 채팅 메시지를 서버로부터 가져오는 함수
  const fetchMessages = () => {
    axios
      .get(`/api/chatroom/${roomId}/messages`)
      .then((response) => {
        console.log("메시지 목록", response.data);
        setMessages(response.data);
      })
      .catch((error) => console.error("Failed to fetch chat messages.", error));
  };
  // 새 메시지를 보내는 함수
  const sendMessage = () => {
    if (stompClient.current && message) {
      const messageObj = {
        chatroomSeq: roomId,
        senderSeq: currentUser.userSeq,
        sender: currentUser.userId,
        message: message,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(messageObj));
      setMessage(""); // 입력 필드 초기화
    }
  };

  return (
  <div className="chatting-container">
    <div className="chatting-header">
      <button onClick={() => window.history.back()} className="back-button">←</button>
      <span className="chatting-title">채팅방 #{roomId}</span>
    </div>

    <div className="chatting-body">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chatting-message ${msg.senderSeq === currentUser.userSeq ? 'me' : 'other'}`}
        >
          {msg.message}
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
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button className="send-button" onClick={sendMessage}>✈</button>
    </div>
  </div>
  );
};

export default Chatting;
