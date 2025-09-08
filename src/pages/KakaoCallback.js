import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';

const KakaoCallback = () => {
  const navigate = useNavigate();

  // URL에서 code, state 추출
  const code = new URL(window.location.href).searchParams.get("code");
  const state = new URL(window.location.href).searchParams.get("state"); // 있을 경우

  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oauth/kakao/callback?code=${code}`
        );

        if (response.data.code === "SU" && response.data.token) {
          // ✅ 로그인 성공 처리
          localStorage.setItem("token", response.data.token); // JWT 저장
          localStorage.setItem("studentNum", response.data.studentNum); // 학번 저장
          console.log("✅ 소셜 로그인 성공", response.data);

          const userRole = response.data.role; 
          localStorage.setItem("role", userRole);  // 추가

          if (userRole === "COUNCIL") {
            navigate("/select");       // 학생이면 기존대로 Home
          } else if (userRole === "STUDENT") {
            navigate("/home");     // 학생회이면 Select 페이지
          }

        } else {
          // 실패 처리
          console.error("❌ 소셜 로그인 실패", response.data);
          navigate("/login");
        }
        
      } catch (error) {
        console.log("KAKAO CLIENT_ID:", process.env.REACT_APP_REST_API_KEY_KAKAO);
        console.log("KAKAO REDIRECT:", process.env.REACT_APP_REDIRECT_URL_KAKAO);
        console.error("❌ 소셜 로그인 실패", error);
        navigate("/login");
      }
    };

    if (code) kakaoLogin();
  }, [code, state, navigate]);

  return (
    <div className="KakaoCallback">
      <div className="notice">
        <p>로그인 중입니다.</p>
        <p>잠시만 기다려주세요.</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default KakaoCallback;
