import React from "react";
import Navbar from "./Navbar";               // 학생용
import NavbarCouncil from "./NavbarCouncil"; // 학생회용
import { useAuth } from "../AuthContext";

function RoleBasedNavbar() {
  const { role } = useAuth();

  if (role === "COUNCIL") return <NavbarCouncil />;
  return <Navbar />;
}

export default RoleBasedNavbar;
