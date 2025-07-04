import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';

const Mypage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <h2 className="page-title">My Page</h2>

      <div className="mypage-profile">
        <div className="mypage-info">
          <div className="info-row">
            <span className="label">이름</span>
            <span className="value">홍길동</span>
          </div>
          <div className="info-row">
            <span className="label">학번</span>
            <span className="value">32221234</span>
          </div>
          <div className="info-row">
            <span className="label">학과</span>
            <span className="value">소프트웨어학과</span>
          </div>
          <div className="info-row">
            <span className="label">생년월일</span>
            <span className="value">20010518</span>
          </div>
          <div className="info-row">
            <span className="label">전화번호</span>
            <span className="value">01012345678</span>
          </div>
        </div>
      </div>

      <button className="edit-button" onClick={() => navigate('/edit')}>
      개인정보 수정 요청
    </button>
    </div>
  );
};

export default Mypage;
