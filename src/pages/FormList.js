import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  "전체", "SW융합대학 학생회", "소프트웨어", "컴퓨터공학", "통계", "사이버보안"
];

const DUMMY_EVENTS = [
  {
    id: 1,
    name: "새내기배움터",
    department: "SW융합대학 학생회",
    startDate: "2025-03-14",
    endDate: "2025-03-16",
    total: 5,
    current: 3,
    participants: [
      { id: 1, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
    ]
  },
  {
    id: 2,
    name: "SW합창제전",
    department: "SW융합대학 학생회",
    startDate: "2025-03-30",
    endDate: "2025-04-07",
    total: 25,
    current: 3,
    participants: [
      { id: 3, avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { id: 4, avatar: "https://randomuser.me/api/portraits/women/4.jpg" }
    ]
  }
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const FormList = () => {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredEvents = DUMMY_EVENTS.filter(ev =>
    (filter === "전체" || ev.department === filter) &&
    ev.name.includes(search)
  );

  return (
    <Container>
      <Header>신청 폼 목록</Header>
      <SearchBox>
        <SearchInput
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchBox>
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
      <EventList>
        {filteredEvents.map(ev => (
          <EventCard onClick={() => navigate(`/event/${ev.id}`)}> 
            <EventTitle>{ev.name}</EventTitle>
            <EventPeriod>
              {formatDate(ev.startDate)} ~ {formatDate(ev.endDate)}
            </EventPeriod>
            <ProgressRow>
              <ProgressText>{ev.current}/{ev.total}</ProgressText>
              <ProgressBar>
                <ProgressFill width={ev.current / ev.total * 100} color={ev.id === 1 ? '#7ed957' : '#ffd36e'} />
              </ProgressBar>
            </ProgressRow>
            <AvatarRow>
              {ev.participants.map(p => (
                <Avatar key={p.id} src={p.avatar} />
              ))}
            </AvatarRow>
          </EventCard>
        ))}
      </EventList>
    </Container>
  );
};

export default FormList;

// 스타일
const Container = styled.div`
  padding: 0 16px 16px 16px;
  background: #fff;
  min-height: 100vh;
`;
const Header = styled.h2`
  text-align: center;
  margin: 24px 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #222;
`;
const SearchBox = styled.div`
  margin-bottom: 12px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;
const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  overflow-x: auto;
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
const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const EventCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(108,92,231,0.07);
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 16px rgba(108,92,231,0.13);
  }
`;
const EventTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #222;
`;
const EventPeriod = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
`;
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const ProgressText = styled.div`
  font-size: 13px;
  color: #6c5ce7;
  font-weight: 600;
  min-width: 38px;
`;
const ProgressBar = styled.div`
  flex: 1;
  height: 7px;
  background: #f2f2f2;
  border-radius: 6px;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${({ width }) => width + "%"};
  background: ${({ color }) => color || '#7ed957'};
  border-radius: 6px;
  transition: width 0.3s;
`;
const AvatarRow = styled.div`
  display: flex;
  margin-top: 6px;
`;
const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-right: -8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;