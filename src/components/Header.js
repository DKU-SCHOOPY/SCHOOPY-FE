import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Bell } from "lucide-react";

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 70px; /* 높이 조정 */
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  z-index: 1000;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const DateText = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 20px;
  text-align: center;
  flex-grow: 1;
  text-align: center;
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("ko-KR", options);

  return (
    <HeaderContainer>
      {location.pathname === "/create" ? (
        <>
          <BackButton onClick={() => navigate("/")}>←</BackButton>
          <Title>게시물 생성</Title>
          <div style={{ width: "24px" }} /> {}
        </>
      ) : (
        <><div style={{ width: "24px" }} /> {}
          <DateText>{formattedDate}</DateText>
          <NotificationButton onClick={() => navigate("/notifications")}>
            <Bell size={24} />
          </NotificationButton>
        </>
      )}
    </HeaderContainer>
  );
}
