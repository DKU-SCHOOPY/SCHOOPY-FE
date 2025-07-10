import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const KakaoLinkCallback = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const state = "link"; // 강제로 고정
  const navigate = useNavigate();

  useEffect(() => {
    const sendLinkRequest = async () => {
      try {
        const studentNum = localStorage.getItem("studentNum");

        const res = await axios.post(`${API_BASE_URL}/oauth/kakao/link`, {
          studentNum,
          code,
          state,
        });

        console.log("카카오 연동 완료", res.data);
        navigate("/mypage");
      } catch (err) {
        console.error("카카오 연동 실패", err);
        navigate("/mypage");
      }
    };

    if (code) sendLinkRequest();
  }, [code, navigate]);

  return <p>카카오 계정 연동 중입니다...</p>;
};

export default KakaoLinkCallback;
