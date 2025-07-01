import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { API_BASE_URL } from '../config';
import './Home.css';

const FILTERS = [
  "전체","SW융합대학", "소프트웨어학과", "컴퓨터공학과", "통계", "사이버보안"
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [alarmCount, setAlarmCount] = useState(3); // 예시
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${API_BASE_URL}/event/home`);
        setPosts(res.data);
      } catch (err) {
        console.error("이벤트 불러오기 실패", err);
      }
    }
    fetchEvents();
  }, []);

  const filteredPosts = posts.filter(
    post => filter === FILTERS[0] || post.department === filter
  );

  const noticeCount = localStorage.getItem("noticeCount");

  return (
    <div className="container">
      {/* 상단 제목 + 알림 */}
      <div className="page-title">
        <span>게시물</span>
        <Link to="/alarm" className="bell-wrapper">
          <FiBell size={22} />
          {noticeCount > 0 && <span className="badge">{noticeCount}</span>}
        </Link>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-button ${filter === f ? "selected" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="post-list">
        {filteredPosts.map(post => (
          <div
            className="event-card"
            key={post.eventCode}
            onClick={() => navigate(`/form/${post.eventCode}`)}
          >
            <img
              className="event-image"
              src={post.eventImages?.[0] || "/default.jpg"}
              alt={post.eventName}
            />
            <div className="event-info">
              <div className="event-title">{post.eventName}</div>
              <div className="event-sub">{post.department}</div>
              <div className="event-desc">{post.eventDescription}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
