import React from "react";
import { Navigate, useParams } from "react-router-dom";

function RoleBasedRoute({ student: StudentComp, council: CouncilComp }) {
  const role = localStorage.getItem("role");  // localStorage에서 role 읽음

  if (!role) return <Navigate to="/login" />;          // 로그인 안됨
  if (role === "STUDENT") return <StudentComp />;      // 학생이면 Form
  if (role === "COUNCIL") return <CouncilComp />;      // 학생회면 Event

  return <Navigate to="/not-authorized" />;            // 이상한 role
}

export default RoleBasedRoute;
