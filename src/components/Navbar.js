import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Home, FileText, Calendar, MessageCircle, User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <NavContainer>
      <NavItem
        onClick={() => navigate("/home")}
        active={currentPath.startsWith("/home")}
      >
        <Home size={24} />
      </NavItem>
      <NavItem
        onClick={() => navigate("/formlist")}
        active={currentPath.startsWith("/formlist")}
      >
        <FileText size={24} />
      </NavItem>
      <NavItem
        onClick={() => navigate("/calendar")}
        active={currentPath.startsWith("/calendar")}
      >
        <Calendar size={24} />
      </NavItem>
      <NavItem
        onClick={() => navigate("/chat")}
        active={currentPath.startsWith("/chat")}
      >
        <MessageCircle size={24} />
      </NavItem>
      <NavItem
        onClick={() => navigate("/mypage")}
        active={currentPath.startsWith("/mypage")}
      >
        <User size={24} />
      </NavItem>
    </NavContainer>
  );
}

const NavContainer = styled.div`
  width: 700px;          /* 항상 700px */
  height: 56px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;        /* 중앙 정렬 */
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 내부 아이템 간격 독립 처리 */
  border-top: 1px solid #ddd;
  z-index: 1000;
  box-sizing: border-box;
  padding: 0 20px;       /* 내부 아이템 padding */
  min-width: 0;

  @media (max-width: 700px) {
    max-width: 100%;
    left: 0;
    transform: none;
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: ${(props) => (props.active ? "#6a5af9" : "black")};

  @media (max-width: 700px) {
    padding: 6px;
  }

  svg {
    stroke: ${(props) => (props.active ? "#6a5af9" : "black")};
  }
`;

const PostButton = styled.button`
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  background: #6a5af9;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1050;
`;
