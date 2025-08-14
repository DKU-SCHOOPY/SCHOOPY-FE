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
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
console.log(process.env.REACT_APP_KAKAO_REST_API_KEY);
console.log(process.env.REACT_APP_KAKAO_REDIRECT_URI);

      try {
        const studentNum = localStorage.getItem('studentNum');
        const res = await axios.post(`${API_BASE_URL}/auth/mypage`, {
          studentNum: studentNum,
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        const data = res.data;
        if (data.code === 'SU') {
          setUserInfo({
            name: data.name,
            studentNum: data.studentNum,
            department: data.department,
            birthDay: data.birthDay,
            phoneNum: data.phoneNum,
          });
        }
      } catch (err) {
        console.error('개인정보 불러오기 실패', err);
      }
    };

    const fetchLinkedStatus = async () => {
      try {
        const studentNum = localStorage.getItem('studentNum');
        const res = await axios.get(`${API_BASE_URL}/user/social-status?studentNum=${studentNum}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        setIsKakaoLinked(res.data.kakao === true);
        setIsNaverLinked(res.data.naver === true);
      } catch (err) {
        console.error('소셜 연동 상태 불러오기 실패', err);
      }
    };

    fetchUserInfo();
    fetchLinkedStatus();
  }, []);

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
        </div>
      </div>

      <button className="edit-button" onClick={() => navigate('/edit')}>
        개인정보 수정 요청
      </button>

      <div className="login-divider">
        <span>SNS계정 연동하여 간편하게 로그인하기</span>
      </div>

      <div className="link-container">
        <a href={KAKAO_LINK_URL} className="kakaolink">
          <img src={process.env.PUBLIC_URL + "/kakao_link.png"} alt="카카오 연동" />
        </a>
        {isKakaoLinked && <span className="badge kakao">연동 완료</span>}
        <a href={NAVER_LINK_URL} className="naverlink">
          <img src={process.env.PUBLIC_URL + "/naver_link.png"} alt="네이버 연동" />
        </a>
        {isNaverLinked && <span className="badge naver">연동 완료</span>}
      </div>
    </div>
  );
};

export default Mypage;
