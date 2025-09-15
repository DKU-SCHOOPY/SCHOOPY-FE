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

      try {
        const studentNum = localStorage.getItem('studentNum');
        const res = await axios.post(`${API_BASE_URL}/mypage/check`, {
          studentNum: studentNum,
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        const data = res.data;
        console.log(data);
        if (data.code === 'SU') {
          setUserInfo({
            name: data.name,
            studentNum: data.studentNum,
            department: data.department,
            birthDay: data.birthDay,
            phoneNum: data.phoneNum,
          });
        setIsKakaoLinked(res.data.kakaoLogin === true);
        setIsNaverLinked(res.data.naverLogin === true)
        }
      } catch (err) {
        console.error('개인정보 불러오기 실패', err);
      }
    };

    fetchUserInfo();
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
