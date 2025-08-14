import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import OkEnter from "../components/OkEnter";
import "./Login.css";
import { requestPermission, requestFCMToken } from "../firebase"; // firebase 설정에서 import
import { connectSocket } from "../socket";
import { KAKAO_AUTH_URL, NAVER_AUTH_URL } from './OAuth';

function Login() {
  const navigate = useNavigate();
  const [studentNum, setStudentNum] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // // 알림 권한 요청
      // await requestPermission();
      // // FCM 토큰 요청
      
      // const fcmToken = await requestFCMToken();
      // console.log("FCM 토큰:", fcmToken);
      // if (!fcmToken) {
      //   alert("FCM 토큰 요청 실패. 알림 권한 확인 필요");
      //   return;
      // }
      const response = await axios.post(
        `${API_BASE_URL}/auth/sign-in`,
        {
          studentNum,
          password
          //fcmToken
        }
      );

      // 토큰 저장
      const token = response.data.token;
      localStorage.setItem("token", token);

      // const { code, message, token } = response.data;
      const { code, message } = response.data;
      console.log("응답 데이터",response.data);

      if (code === "SU") {
        // console.log("로그인 성공!");
        // alert(`✅ ${message}`);

        localStorage.setItem("studentNum", studentNum);
        localStorage.setItem("noticeCount", response.data.noticeCount);

        // connectSocket(token);
        // if (token) {
        //   localStorage.setItem('accessToken', token);  // ✅ 여기서 저장
           navigate('/home'); // 로그인 후 이동
        // } else {
        //   console.error("토큰 없음");
        // }
        
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "네트워크 오류";
      alert(`❗ ${message}`);
      console.error("Login error:", error);
    }
  };

  return (
    <OkEnter onSubmit={handleLogin}>
    <div className="container">
      <div className="login-text-container">
        <h2 className="page-title">로그인하기</h2>
        <p className="login-subtitle">
          학번과 비밀번호를 입력해주세요
        </p>
      </div>
      <div className="login-button-container">
        <input
          type="text"
          placeholder="Enter your student ID"
          className="login-textarea"
          value={studentNum}
          onChange={(e) => setStudentNum(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="login-textarea"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-forgot">Forgot Password?</button>

        <button className="login-button" onClick={handleLogin}>로그인
        </button>
        <button className="login-button" onClick={() => navigate("/join")}>회원가입
        </button>

        <div className="login-divider">
          <span>또는 소셜 로그인</span>
        </div>


        <div className="login-sns-container">
        <a href={KAKAO_AUTH_URL} className="kakaobtn">
          <img src={process.env.PUBLIC_URL + '/kakao_phone.png'} />
        </a>
        <a href={NAVER_AUTH_URL} className="naverbtn">
          <img src={process.env.PUBLIC_URL + "/naver_phone.png"} />
        </a>
        </div>

      </div>
    </div>
    </OkEnter>
  );
}

export default Login;
