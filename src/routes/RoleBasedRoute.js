// src/routes/RoleBasedRoute.js
import { useAuth } from "../AuthContext";
import { Navigate, useParams } from "react-router-dom";

const RoleBasedRoute = ({ student: StudentComp, council: CouncilComp }) => {
  const { role } = useAuth();
  const { id } = useParams();

  if (role === "student") return <StudentComp id={id} />;
  if (role === "council") return <CouncilComp id={id} />;
  return <Navigate to="/not-authorized" />;
};

export default RoleBasedRoute;
