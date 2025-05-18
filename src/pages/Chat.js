import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Chat.css';

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
