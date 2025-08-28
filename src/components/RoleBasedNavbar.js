import Navbar from "./Navbar";
import NavbarCouncil from "./NavbarCouncil";

function RoleBasedNavbar() {
  const role = localStorage.getItem("role");
  return role === "COUNCIL" ? <NavbarCouncil /> : <Navbar />;
}

export default RoleBasedNavbar;