import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");

    // 기존 토큰/정보 초기화
    localStorage.removeItem("token");
    localStorage.removeItem("studentNum");
    localStorage.removeItem("role");

    if (!code) {
      // code 없으면 카카오 로그아웃 후 재시도
      const logoutRedirect = encodeURIComponent(
        process.env.REACT_APP_REDIRECT_URL_KAKAO
      );
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_REST_API_KEY_KAKAO}&logout_redirect_uri=${logoutRedirect}`;
      return;
    }

    const kakaoLogin = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/oauth/kakao/callback?code=${code}`,
          { withCredentials: true } // 모바일 안정화
        );

        if (response.data.code === "SU" && response.data.token) {
          // 로그인 성공
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("studentNum", response.data.studentNum);
          localStorage.setItem("role", response.data.role);

          const path = response.data.role === "COUNCIL" ? "/select" : "/home";
          navigate(path);
        } else {
          alert(
            "카카오 계정이 학번 계정과 연동되지 않았습니다.\n회원가입 후 소셜로그인 연동을 해주세요."
          );
          navigate("/login");
        }
      } catch (error) {
        console.error("카카오 로그인 오류:", error);
        alert(
          "로그인에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    kakaoLogin();
  }, [navigate]);

  return (
    <div className="KakaoCallback">
      <div className="notice">
        {loading ? (
          <>
            <p>로그인 중입니다.</p>
            <p>잠시만 기다려주세요.</p>
            <div className="spinner"></div>
          </>
        ) : (
          <p>잠시 후 이동합니다...</p>
        )}
      </div>
    </div>
  );
};

export default KakaoCallback;
