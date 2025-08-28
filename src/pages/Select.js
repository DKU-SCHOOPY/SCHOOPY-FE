import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Select() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleSelect = (choice) => {
    setRole(choice);     // STUDENT / COUNCIL 저장
    navigate("/home");   // 이동은 항상 Home
  };

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>이용 목적에 맞게 선택하세요</p>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleSelect("STUDENT")}>학생</button>
        <button style={styles.button} onClick={() => handleSelect("COUNCIL")}>학생회</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "100vh", backgroundColor: "white", paddingTop: "15vh" },
  textContainer: { width: "80%", textAlign: "center" },
  title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" },
  subtitle: { fontSize: "1rem", color: "gray", marginBottom: "30px", lineHeight: "2" },
  buttonContainer: { display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "20rem" },
  button: { width: "200px", padding: "15px", fontSize: "1.2rem", fontWeight: "bold", border: "2px solid #6a5af9", borderRadius: "15px", background: "white", color: "#6a5af9", cursor: "pointer", margin: "10px 0" },
};

export default Select;
