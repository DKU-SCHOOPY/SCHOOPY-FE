import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  "SW융합대학 초필학생회", "소프트웨어학과", "컴퓨터공학과", "통계", "사이버보안"
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(FILTERS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      const res = await axios.get(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/list"
      );
      setPosts(res.data);
    }
    fetchEvents();
  }, []);

  // 필터링
  const filteredPosts = posts.filter(
    post => filter === FILTERS[0] || post.department === filter
  );

  return (
    <HomeContainer>
      <FilterBar>
        {FILTERS.map(f => (
          <FilterButton
            key={f}
            selected={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </FilterButton>
        ))}
      </FilterBar>
      <PostList>
        {filteredPosts.map(post => (
          <EventCard key={post.eventCode}>
            <EventImage
              src={post.eventImages && post.eventImages.length > 0 ? post.eventImages[0] : "/default.jpg"}
              alt={post.eventName}
            />
            <EventInfo>
              <EventTitle>{post.eventName}</EventTitle>
              <EventSub>{post.department}</EventSub>
              <EventDesc>{post.eventDescription}</EventDesc>
            </EventInfo>
          </EventCard>
        ))}
      </PostList>
      {/* 플로팅 + 버튼은 이미 네비바/컴포넌트로 구현되어 있다고 가정 */}
    </HomeContainer>
  );
}

// 스타일
const HomeContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 70px auto 80px auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fafbfc;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  overflow-x: auto;
  width: 100%;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${({ selected }) => selected ? '#eae6fd' : '#f5f5f5'};
  color: ${({ selected }) => selected ? '#6c5ce7' : '#888'};
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`;

const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(108,92,231,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #eee;
`;

const EventInfo = styled.div`
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EventTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #222;
`;

const EventSub = styled.div`
  font-size: 14px;
  color: #6c5ce7;
  margin-bottom: 2px;
`;

const EventDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;