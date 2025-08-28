import React from "react";
import { Navigate } from "react-router-dom";

function RoleBasedRoute({ student: StudentComp, council: CouncilComp }) {
  const role = localStorage.getItem("role");  // localStorage에서 읽음

  if (!role) return <Navigate to="/login" />;        // 로그인 안 되어 있으면
  if (role === "STUDENT") return <StudentComp />;    // 학생이면 Form
  if (role === "COUNCIL") return <CouncilComp />;    // 학생회면 Event

  return <Navigate to="/not-authorized" />;          // 권한 없는 경우
}

export default RoleBasedRoute;
