import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function RoleBasedRoute({ student: StudentComp, council: CouncilComp }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" />; // 로그인 안 되어 있으면 리다이렉트
  }

  if (role === "STUDENT") return <StudentComp />;
  if (role === "COUNCIL") return <CouncilComp />;

  return <Navigate to="/not-authorized" />; // 그 외는 권한 없음
}

export default RoleBasedRoute;
