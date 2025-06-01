import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { requestPermission, requestFCMToken } from "../firebase"; // firebase 설정에서 import
import { connectSocket } from "../socket";

function Login() {
  const navigate = useNavigate();
  const [studentNum, setStudentNum] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 알림 권한 요청
      await requestPermission();
      // FCM 토큰 요청
      
      const fcmToken = await requestFCMToken();
      console.log("FCM 토큰:", fcmToken);
      if (!fcmToken) {
        alert("FCM 토큰 요청 실패. 알림 권한 확인 필요");
        return;
      }
      const response = await axios.post(
        "http://ec2-3-37-86-181.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/sign-in",
        {
          studentNum,
          password,
          fcmToken
        }
      );

      const { code, message, token } = response.data;

      if (code === "SU") {
        //console.log("로그인 성공!");
        //alert(`✅ ${message}`);

        connectSocket(token);
        if (token) {
          localStorage.setItem('accessToken', token);  // ✅ 여기서 저장
          navigate('/calendar'); // 로그인 후 이동
        } else {
          console.error("토큰 없음");
        }
        
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
    <div className="login-container">
      <div className="login-text-container">
        <h2 className="login-title">로그인하기</h2>
        <p className="login-subtitle">
          학번과 <br />
          비밀번호를 입력해주세요
        </p>
      </div>
      <div className="login-button-container">
        <input
          type="text"
          placeholder="Enter your student ID"
          className="login-input"
          value={studentNum}
          onChange={(e) => setStudentNum(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-forgot">Forgot Password?</button>
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
        <button className="login-button" onClick={() => navigate("/join")}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
