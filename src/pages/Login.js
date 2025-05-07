import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // CSS 파일 import

function Login() {
  const navigate = useNavigate();
  const [studentNum, setStudentNum] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/sign-in",
        {
          studentNum,
          password,
        }
      );

      const { code, message, token } = response.data;

      if (code === "SU") {
        console.log("로그인 성공! 토큰:", token);
        alert("✅ 로그인 성공!");
        navigate("/calendar");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
        if (code === "VF") {
          alert("⚠️ 입력값이 유효하지 않습니다.");
        } else if (code === "SF") {
          alert("❌ 이메일 또는 비밀번호가 일치하지 않습니다.");
        } else if (code === "DBE") {
          alert("🚨 서버 오류가 발생했습니다.");
        } else {
          alert(`❗ 오류: ${message}`);
        }
      } else {
        alert("⛔ 네트워크 오류 또는 서버가 응답하지 않습니다.");
        console.error("Unexpected error:", error);
      }
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
