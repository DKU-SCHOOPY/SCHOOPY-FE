// src/pages/NaverCallback.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';

function NaverCallback() {
  console.log("네이버api", process.env.REACT_APP_REST_API_KEY_NAVER);
  console.log("네이버 리다이렉트", process.env.REACT_APP_REDIRECT_URL_NAVER);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const sendCodeToBackend = async () => {
      try {
        // code, state만 백엔드에 전달
        const response = await axios.get(
          `${API_BASE_URL}/oauth/naver/callback?code=${code}&state=${state}`,
        );

        // 백엔드에서 로그인 처리 후 결과 반환
        const { studentNum, token } = response.data;

        if (studentNum && token) {
          localStorage.setItem("studentNum", studentNum);
          localStorage.setItem("accessToken", token);

          const userRole = response.data.role; 
          localStorage.setItem("role", userRole);  // 추가

          if (userRole === "COUNCIL") {
            navigate("/select");       
          } else if (userRole === "STUDENT") {
            navigate("/home");     
          }

        } else {
          // 학번 연동 안 된 경우
          alert("네이버 계정이 학번 계정과 연동되지 않았습니다.\n회원가입 후 다시 시도해주세요.");
          navigate("/login");
        }
      } catch (err) {
        console.error("네이버 로그인 처리 실패:", err);
        alert("네이버 로그인 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    if (code && state) sendCodeToBackend();
  }, [navigate]);

  return <div>네이버 로그인 처리 중입니다...</div>;
}

export default NaverCallback;
