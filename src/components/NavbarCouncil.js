import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Home, FileText, Plus, MessageCircle, User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <NavItem onClick={() => navigate("/home")}>
        <Home size={24} />
      </NavItem>
      <NavItem onClick={() => navigate("/formlist")}>
        <FileText size={24} />
      </NavItem>
      <NavItem onClick={() => navigate("/createpost")}>
        <Plus size={24} />
      </NavItem>
      <NavItem onClick={() => navigate("/chat")}>
        <MessageCircle size={24} />
      </NavItem>
      <NavItem onClick={() => navigate("/mypage")}>
        <User size={24} />
      </NavItem>
    </NavContainer>
  );
}

// 스타일
const NavContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 56px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #ddd;
  z-index: 1000;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: black;

  @media (max-width: 600px) {
    padding: 6px;
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