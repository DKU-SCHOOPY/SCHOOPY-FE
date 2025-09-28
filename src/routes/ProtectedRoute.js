import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // 토큰 없으면 로그인으로
      return;
    }

    try {
      const decoded = jwtDecode(token); // JWT 디코딩
      const now = Date.now() / 1000; // 초 단위

      if (decoded.exp < now) {
        // 토큰 만료
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setIsChecking(false); // 유효하면 페이지 표시
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (isChecking) {
    return <div>Loading...</div>; // 토큰 체크 중일 때
  }

  return <>{children}</>;
}
