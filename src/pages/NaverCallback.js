// src/pages/NaverCallback.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';

function NaverCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      console.error("네이버 로그인: code 또는 state가 없습니다.");
      alert("네이버 로그인에 실패했습니다. 다시 시도해주세요.");
      navigate("/login");
      setLoading(false);
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        // code, state만 백엔드에 전달
        const response = await axios.get(
          `${API_BASE_URL}/oauth/naver/callback?code=${code}&state=${state}`,
        );

        // 카카오와 동일한 응답 구조 확인
        if (response.data.code === "SU" && response.data.token) {
          // 로그인 성공
          localStorage.setItem("token", response.data.token); // accessToken → token으로 수정
          localStorage.setItem("studentNum", response.data.studentNum);
          localStorage.setItem("role", response.data.role);

          const path = response.data.role === "COUNCIL" ? "/select" : "/home";
          navigate(path);
        } else {
          // 학번 연동 안 된 경우
          alert("네이버 계정이 학번 계정과 연동되지 않았습니다.\n회원가입 후 소셜로그인 연동을 해주세요.");
          navigate("/login");
        }
      } catch (err) {
        console.error("네이버 로그인 처리 실패:", err);
        const errorMessage = err.response?.data?.message || "네이버 로그인 처리 중 오류가 발생했습니다.";
        alert(`네이버 계정이 기존 계정과 연동되지 않았습니다.\n회원가입 후 소셜로그인 연동을 해주세요.\n\n오류: ${errorMessage}`);
        navigate("/join");
      } finally {
        setLoading(false);
      }
    };

    sendCodeToBackend();
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div>
          <p>네이버 로그인 처리 중입니다...</p>
          <p>잠시만 기다려주세요.</p>
        </div>
      ) : (
        <p>잠시 후 이동합니다...</p>
      )}
    </div>
  );
}

export default NaverCallback;
