import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Chat.css';

function ChatRoomList() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const currentUser = { userId: localStorage.getItem("studentNum") }; // 임시 userId, 실제론 useSelector 사용

useEffect(() => {
  if (!currentUser || !currentUser.userId) return;
  const studentId = parseInt(currentUser.userId);

  axios.get(`${API_BASE_URL}/chat/council/contacts/${studentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then((res) => {
      if (res.data && Array.isArray(res.data.contacts)) {
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

    // .then((res) => {
    //   const data = res.data.map((room) => ({
    //     id: room.roomId,
    //     name: room.counterpartName,   // 이름으로 표시
    //     lastMessage: room.lastMessage, // 마지막 메시지
    //     status: "활성 채팅"
    //   }));
      
    //   setChats(data);
    //   console.log(data);

    // })
    
    // .catch((err) => console.error("채팅방 목록 불러오기 실패", err));


  const filteredChats = chats.filter(chat =>
  (chat.name || "").toLowerCase().includes((search || "").toLowerCase())
);


  return (
    <div className="container">
      <h2 className="page-title">채팅</h2>

      <div className="searchbox">
        <input
          className="searchinput"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="chat-list">
  {filteredChats.map(chat => (
    <Link
      key={chat.presidentStudentNum}
      to={`/chat/room/${chat.presidentStudentNum}`}
      state={{ otherUserId: chat.presidentStudentNum,
        otherUserName: chat.department
       }} 
    >
      <div className="chat-item">
        <FaUserCircle className="chat-avatar" />
        <div className="chat-info">
          <div className="chat-name">{chat.department}</div>
          <div className="chat-last-message">{chat.lastMessage}</div>
        </div>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}

export default ChatRoomList;


/*
const Chat = () => {
  const navigate = useNavigate();

  const chats = [
    { id: 1, name: '소프트웨어학과', status: 'Active now' },
    { id: 2, name: 'SW융합대학 초월학생회', status: 'Active 1h ago' }
  ];

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat</h2>
      <input type="text" placeholder="Search" className="chat-search" />
      <div className="chat-list">
        {chats.map(chat => (
          <div key={chat.id} className="chat-item" onClick={() => navigate(`/chat/${chat.id}`)}>
            <FaUserCircle className="chat-avatar" />
            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-status">{chat.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
*/