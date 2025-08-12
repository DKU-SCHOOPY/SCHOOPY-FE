import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate } from "react-router-dom";

const NaverLinkCallback = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const state = new URL(window.location.href).searchParams.get("state");
  const navigate = useNavigate();

  useEffect(() => {
    const sendLinkRequest = async () => {
      try {
        const studentNum = localStorage.getItem("studentNum");

        const res = await axios.post(`${API_BASE_URL}/oauth/naver/link`, {
          studentNum,
          code,
          state,
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

        console.log("네이버 연동 완료", res.data);
        navigate("/mypage");
      } catch (err) {
        console.error("네이버 연동 실패", err);
        navigate("/mypage");
      }
    };

    if (code && state) sendLinkRequest();
  }, [code, state, navigate]);

  return <p>네이버 계정 연동 중입니다...</p>;
};

export default NaverLinkCallback;
