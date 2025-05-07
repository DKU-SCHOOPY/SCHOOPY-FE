import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

// 더미 행사 데이터
const DUMMY_EVENTS = [
  {
    id: 1,
    name: "새내기배움터",
    participants: [
      {
        id: 1,
        name: "홍길동",
        major: "소웨 25",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "Active now"
      },
      // ...생략
    ]
  },
  // ...다른 행사
];

export default function EventApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = DUMMY_EVENTS.find(ev => ev.id === Number(id));
  const [participants, setParticipants] = useState(event?.participants || []);

  const handleApprove = async (applicationId, isAccept) => {
    try {
      await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/approve",
        {
            applicationId: Number(applicationId), // 반드시 숫자!
            choice: Boolean(isAccept)
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (isAccept) {
        alert("신청이 승인되었습니다!");
        // 승인 시에는 상태만 바꿀 수도 있고, 그대로 둘 수도 있음
      } else {
        // 거절 시 리스트에서 제거
        setParticipants(prev => prev.filter(p => p.id !== applicationId));
      }
    } catch (e) {
      alert("처리 실패: " + e.message);
    }
  };

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={() => navigate(-1)}>&larr;</BackBtn>
        <EventTitle>{event?.name}</EventTitle>
        <RightSpace />
      </TopBar>
      <UserList>
        {event?.participants.map(user => (
          <UserRow key={user.id}>
            <Avatar src={user.avatar} />
            <UserInfo>
              <UserName>{user.major} {user.name}</UserName>
              <UserStatus>{user.status}</UserStatus>
            </UserInfo>
            <ActionButtons>
                <AcceptBtn onClick={() => handleApprove(user.id, true)}>수락</AcceptBtn>
                <RejectBtn onClick={() => handleApprove(user.id, false)}>거절</RejectBtn>
            </ActionButtons>
          </UserRow>
        ))}
      </UserList>
    </Container>
  );
}

// 스타일
const Container = styled.div`
  padding: 0 0 80px 0;
  background: #fff;
  min-height: 100vh;
  position: relative;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px 18px 20px;
`;
const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  width: 32px;
`;
const EventTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
  flex: 1;
  text-align: center;
`;
const RightSpace = styled.div`
  width: 32px;
`;
const UserList = styled.div`
  margin: 0 16px;
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 0 12px 0;
  border-bottom: 1px solid #f2f2f2;
`;
const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 14px;
  object-fit: cover;
  border: 2px solid #f5f5f5;
`;
const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #222;
`;
const UserStatus = styled.div`
  font-size: 13px;
  color: #7c7c7c;
  margin-top: 2px;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;
const AcceptBtn = styled.button`
  background: #7ed957;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
const RejectBtn = styled.button`
  background: #ffd36e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;