import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Chat.css';

function ChatRoomList() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const currentUser = { userId: "32203027" }; // 임시 userId, 실제론 useSelector 사용

  useEffect(() => {
    if (!currentUser || !currentUser.userId) return;
    const studentId = parseInt(currentUser.userId);

    axios.get(`http://ec2-3-37-86-181.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/chat/rooms/${studentId}`)
      .then((res) => {
        const data = res.data.map((room) => {
          const otherUser = room.userA === studentId ? room.userB : room.userA;
          return {
            id: room.id,
            name: `${otherUser}`,
            status: "활성 채팅",
          };
        });
        setChats(data);
      })
      .catch((err) => console.error("채팅방 목록 불러오기 실패", err));
  }, [currentUser]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat</h2>
      <input
        type="text"
        placeholder="Search"
        className="chat-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chat-list">
        {filteredChats.map(chat => (
          <Link
            key={chat.id}
            to={`/chat/room/${chat.id}`}
            state={{ otherUserId: chat.name }} // chat.name = 실제 상대방 ID여야 함
          >
      <div className="chat-item">
        <FaUserCircle className="chat-avatar" />
        <div className="chat-info">
          <div className="chat-name">{chat.name}</div>
          <div className="chat-status">{chat.status}</div>
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