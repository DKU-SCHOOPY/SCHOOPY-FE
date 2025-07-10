import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  // URL에서 code, state 추출
  const code = new URL(window.location.href).searchParams.get("code");
  const state = new URL(window.location.href).searchParams.get("state"); // 있을 경우

  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/oauth/kakao/callback`,
          {
            params: { code, state },
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        console.log("✅ 소셜 로그인 성공", response.data);

        // 사용자 정보 저장
        localStorage.setItem("name", response.data.account.kakaoName);

        // 로그인 완료 후 페이지 이동
        navigate("/home");
      } catch (error) {
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
