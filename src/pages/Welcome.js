import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* PC & 모바일에서 적용될 이미지 */}
        <img src="/welcomeimage.png" alt="Welcome" className="welcome-image" />
        
        {/* 텍스트 및 버튼 */}
        <div className="welcome-text">
          <h1>Schoopy</h1>
          <h2>쉽고 간단한 캠퍼스 생활</h2>
          <p>한눈에 보는 학사 일정과 개인 일정<br />각종 행사 안내 및 신청</p>
          <button className="start-button" onClick={() => navigate("/login")}>
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
