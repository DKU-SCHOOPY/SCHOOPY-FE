import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FILTERS = [
  "전체", "SW융합대학 학생회", "소프트웨어", "컴퓨터공학", "통계", "사이버보안"
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const FormList = () => {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log("Fetching events...");
        const res = await axios.get(
          "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/get-active"
        );
        console.log("Raw API Response:", res.data);

        if (!res.data || !Array.isArray(res.data)) {
          console.error("Invalid API response format:", res.data);
          return;
        }

        const mapped = res.data.map(ev => {
          console.log("Processing event:", ev);
          const mappedEvent = {
            id: ev.eventCode,
            name: ev.eventName,
            department: ev.department,
            startDate: ev.eventStartDate,
            endDate: ev.eventEndDate,
            surveyStartDate: ev.surveyStartDate,
            surveyEndDate: ev.surveyEndDate,
            total: parseInt(ev.maxParticipants) || 0,
            current: parseInt(ev.currentParticipants) || 0,
            description: ev.eventDescription,
            eventImages: ev.eventImages || [],
            qrCodeImages: ev.qrCodeImages || []
          };
          console.log("Mapped event:", mappedEvent);
          return mappedEvent;
        });

        console.log("All mapped events:", mapped);
        setEvents(mapped);
      } catch (err) {
        console.error("이벤트 데이터를 불러오는 데 실패했습니다:", err);
        console.error("Error details:", err.response?.data || err.message);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(ev =>
    (filter === "전체" || ev.department === filter) &&
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Current filter:", filter);
  console.log("Current search:", search);
  console.log("Filtered events:", filteredEvents);

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
        {filteredEvents.length === 0 ? (
          <NoEventsMessage>등록된 이벤트가 없습니다.</NoEventsMessage>
        ) : (
          filteredEvents.map(ev => (
            <EventCard key={ev.id} onClick={() => navigate(`/form/${ev.id}`)}>
              <EventTitle>{ev.name}</EventTitle>
              <EventPeriod>
                {formatDate(ev.startDate)} ~ {formatDate(ev.endDate)}
              </EventPeriod>
              <ProgressRow>
                <ProgressText>{ev.current}/{ev.total}</ProgressText>
                <ProgressBar>
                  <ProgressFill
                    width={(ev.current / ev.total) * 100}
                    color={ev.id % 2 === 0 ? '#ffd36e' : '#7ed957'}
                  />
                </ProgressBar>
              </ProgressRow>
            </EventCard>
          ))
        )}
      </EventList>
    </Container>
  );
};

export default FormList;

// 스타일 컴포넌트들
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

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 16px;
`;
