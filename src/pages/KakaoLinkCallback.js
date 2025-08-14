import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate } from "react-router-dom";

const KakaoLinkCallback = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const state = "link"; // 강제로 고정
  const navigate = useNavigate();

  useEffect(() => {
    const sendLinkRequest = async () => {

      <p>연동 중입니다... 잠시만 기다려주세요.</p>

      try {
        const studentNum = localStorage.getItem("studentNum");

        const res = await axios.post(`${API_BASE_URL}/oauth/kakao/link`, {
          studentNum,
          code,
          state,
        },
  );

        
        console.log("카카오 연동 완료", res.data);
        alert("✅ 카카오 연동이 완료되었습니다");
        navigate("/mypage");
      } catch (err) {
        console.error("카카오 연동 실패", err);
        alert("❌ 연동 중 오류가 발생했습니다. 다시 시도해주세요");
        navigate("/mypage");
      }
    };

    if (code) sendLinkRequest();
  }, [code, navigate]);

  return <p>카카오 계정 연동 중입니다...</p>;
};

export default KakaoLinkCallback;
