import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate, Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import './Home.css';
import FilterBar from "../components/FilterBar";

const FILTERS = [
  "전체", "SW융합대학", "소프트웨어학과", "컴퓨터공학과", "통계데이터사이언스학과", "사이버보안학과"
];

export default function Home() {
  const [post, setPosts] = useState([]);
  const [selected, setSelected] = useState(FILTERS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${API_BASE_URL}/home/feedback`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        setPosts(res.data);
        console.log(res);
      } catch (err) {
        console.error("이벤트 불러오기 실패", err);
      }
    }
    fetchEvents();
  }, []);

  const filteredPosts = post.filter(
    post => selected === "전체" || post.department === selected
  );

  const noticeCount = localStorage.getItem("noticeCount");

  return (
    <div className="container">
      {/* 상단 제목 + 알림 */}
      <div className="page-title">
        <span>게시물</span>
        <Link to="/alarm" className="bell-wrapper">
          <FiBell size={22} />
          {noticeCount > 0 && <span className="alarm-badge">{noticeCount}</span>}
        </Link>
      </div>

      {/* 필터바 (공통 컴포넌트 사용) */}
      <FilterBar
        filters={FILTERS}
        selected={selected}
        onSelect={setSelected}
      />

      {/* 게시물 목록 */}
      <div className="post-list">
        {filteredPosts.map(post => (
          <div
            className="home-event-card"
            key={post.eventCode}
            onClick={() => navigate(`/eventdetail/${post.eventCode}`)}
          >
            <img
              className="home-event-image"
              src={post.eventImages?.[0] || "/003.jpg"}
              alt={post.eventName}
            />
            <div className="home-event-info">
              <div className="home-event-title">{post.eventName}</div>
              <div className="home-event-sub">{post.department}</div>
              <div className="home-event-desc">{post.eventDescription}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
