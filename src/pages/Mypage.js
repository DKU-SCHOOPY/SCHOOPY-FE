import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Mypage.css';
import { KAKAO_LINK_URL, NAVER_LINK_URL } from './OAuth';

const Mypage = () => {
  const navigate = useNavigate();
  const [isKakaoLinked, setIsKakaoLinked] = useState(false);
  const [isNaverLinked, setIsNaverLinked] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    studentNum: '',
    department: '',
    birthDay: '',
    phoneNum: '',
    councilPee: false,
    departmentCouncilPee: false,
    enrolled: false,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const studentNum = localStorage.getItem('studentNum');
        const res = await axios.post(
          `${API_BASE_URL}/mypage/all/check`,
          { studentNum },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data;
        if (data.code === 'SU' && data.user) {
          const u = data.user;
          setUserInfo({
            name: u.name,
            studentNum: u.studentNum,
            department: u.department,
            birthDay: u.birthDay,
            phoneNum: u.phoneNum,
            councilPee: u.councilPee,
            departmentCouncilPee: u.departmentCouncilPee,
            enrolled: u.enrolled,
          });
          setIsKakaoLinked(Boolean(data.kakaoLogin));
          setIsNaverLinked(Boolean(data.naverLogin));
        }
      } catch (err) {
        console.error('개인정보 불러오기 실패', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    ["token", "studentNum", "role", "noticeCount"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/login");
  };

  const handleEdit = () => {
    const role = localStorage.getItem("role");
    if (role === "COUNCIL") navigate("/councilfee");
    else {
      navigate("/edit", {
        state: {
          department: userInfo.department,
          councilPee: userInfo.councilPee,
          departmentCouncilPee: userInfo.departmentCouncilPee,
          enrolled: userInfo.enrolled,
        },
      });
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">My Page</h2>

      <div className="mypage-profile">
        <div className="mypage-info">
          {[
            ["이름", userInfo.name],
            ["학번", userInfo.studentNum],
            ["학과", userInfo.department],
            ["생년월일", userInfo.birthDay],
            ["전화번호", userInfo.phoneNum],
            ["총학생회비 납부", userInfo.councilPee ? "납부" : "미납부"],
            ["과학생회비 납부", userInfo.departmentCouncilPee ? "납부" : "미납부"],
            ["재학 상태", userInfo.enrolled ? "재학" : "휴학"],
          ].map(([label, value]) => (
            <div className="info-row" key={label}>
              <span className="my-label">{label}</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="edit-button" onClick={handleEdit}>
        {localStorage.getItem("role") === "COUNCIL"
          ? "학생회비 관리"
          : "개인정보 수정 요청"}
      </button>

      <div className="login-divider">
        <span>SNS 계정 연동하여 간편하게 로그인하기</span>
      </div>

      <div className="link-container">
        <button
          className={`kakaolink ${isKakaoLinked ? "disabled" : ""}`}
          onClick={() =>
            !isKakaoLinked && window.location.assign(KAKAO_LINK_URL)
          }
          aria-label="카카오 계정 연동"
        >
          <img
            src={`${process.env.PUBLIC_URL}/kakao_link.png`}
            alt="카카오 연동"
          />
        </button>

        <button
          className={`naverlink ${isNaverLinked ? "disabled" : ""}`}
          onClick={() =>
            !isNaverLinked && window.location.assign(NAVER_LINK_URL)
          }
          aria-label="네이버 계정 연동"
        >
          <img
            src={`${process.env.PUBLIC_URL}/naver_link.png`}
            alt="네이버 연동"
          />
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default Mypage;
