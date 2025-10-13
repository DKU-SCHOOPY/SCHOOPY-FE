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
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(FILTERS[0]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  // 이벤트 가져오기
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${API_BASE_URL}/home/feedback`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setPosts(res.data);
      } catch (err) {
        console.error("이벤트 불러오기 실패", err);
      }
    }
    fetchEvents();
  }, []);

  // 삭제
  const handleDelete = async (eventCode) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/events/${eventCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts((prev) => prev.filter(post => post.eventCode !== eventCode));
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const filteredPosts = posts.filter(
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

      {/* 필터바 */}
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

            {/* 우측 상단 드롭다운 버튼 */}
            <div
              className="dropdown-wrapper"
              onClick={(e) => e.stopPropagation()} // 카드 클릭 막기
            >
              <button
                className="dropdown-btn"
                onClick={() =>
                  setOpenDropdownId(
                    openDropdownId === post.eventCode ? null : post.eventCode
                  )
                }
              >
                ⋮
              </button>

              {openDropdownId === post.eventCode && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => navigate(`/edit-event/${post.eventCode}`)}
                  >
                    수정
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleDelete(post.eventCode)}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
