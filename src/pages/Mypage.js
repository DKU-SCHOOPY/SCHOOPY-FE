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
    councilPee: false,              // ✅ 총학생회비
    departmentCouncilPee: false,    // ✅ 과학생회비
    enrolled: false,                // ✅ 재학 여부
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const studentNum = localStorage.getItem('studentNum');
        const res = await axios.post(
          `${API_BASE_URL}/mypage/all/check`,
          { studentNum: studentNum },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data;
        console.log(data);

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
          setIsKakaoLinked(data.kakaoLogin === true);
          setIsNaverLinked(data.naverLogin === true);
        }
      } catch (err) {
        console.error('개인정보 불러오기 실패', err);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentNum");
    localStorage.removeItem("role");
    localStorage.removeItem("noticeCount");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2 className="page-title">My Page</h2>

      <div className="mypage-profile">
        <div className="mypage-info">
          <div className="info-row">
            <span className="my-label">이름</span>
            <span className="value">{userInfo.name}</span>
          </div>
          <div className="info-row">
            <span className="my-label">학번</span>
            <span className="value">{userInfo.studentNum}</span>
          </div>
          <div className="info-row">
            <span className="my-label">학과</span>
            <span className="value">{userInfo.department}</span>
          </div>
          <div className="info-row">
            <span className="my-label">생년월일</span>
            <span className="value">{userInfo.birthDay}</span>
          </div>
          <div className="info-row">
            <span className="my-label">전화번호</span>
            <span className="value">{userInfo.phoneNum}</span>
          </div>

          {/* ✅ 추가 정보 표시 */}
          <div className="info-row">
            <span className="my-label">총학생회비 납부</span>
            <span className="value">{userInfo.councilPee ? "납부" : "미납부"}</span>
          </div>
          <div className="info-row">
            <span className="my-label">과학생회비 납부</span>
            <span className="value">{userInfo.departmentCouncilPee ? "납부" : "미납부"}</span>
          </div>
          <div className="info-row">
            <span className="my-label">재학 상태</span>
            <span className="value">{userInfo.enrolled ? "재학" : "휴학"}</span>
          </div>
        </div>
      </div>

      <button
        className="edit-button"
        onClick={() =>
          localStorage.getItem("role") === "COUNCIL"
            ? navigate("/councilfee")
            : navigate("/edit", {
          state: { department: userInfo.department, councilPee: userInfo.councilPee,
    departmentCouncilPee: userInfo.departmentCouncilPee, enrolled: userInfo.enrolled },
        })
        }
      >
        {localStorage.getItem("role") === "COUNCIL"
          ? "학생회비 관리"
          : "개인정보 수정 요청"}
      </button>

      <div className="login-divider">
        <span>SNS계정 연동하여 간편하게 로그인하기</span>
      </div>

      <div className="link-container">
        <a
          href={isKakaoLinked ? undefined : KAKAO_LINK_URL}
          className={`kakaolink ${isKakaoLinked ? "disabled" : ""}`}
          onClick={isKakaoLinked ? (e) => e.preventDefault() : undefined}
        >
          <img
            src={process.env.PUBLIC_URL + "/kakao_link.png"}
            alt="카카오 연동"
          />
        </a>

        <a
          href={isNaverLinked ? undefined : NAVER_LINK_URL}
          className={`naverlink ${isNaverLinked ? "disabled" : ""}`}
          onClick={isNaverLinked ? (e) => e.preventDefault() : undefined}
        >
          <img
            src={process.env.PUBLIC_URL + "/naver_link.png"}
            alt="네이버 연동"
          />
        </a>
      </div>

      {/* ✅ 로그아웃 버튼 */}
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default Mypage;
