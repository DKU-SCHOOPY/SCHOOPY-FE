import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [studentNum, setStudentNum] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/sign-in",
        {
          studentNum,
          password,
        }
      );

      const { code, message, token } = response.data;

      if (code === "SU") {
        console.log("로그인 성공! 토큰:", token);
        alert("✅ 로그인 성공!");
        // navigate("/home");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
        if (code === "VF") {
          alert("⚠️ 입력값이 유효하지 않습니다.");
        } else if (code === "SF") {
          alert("❌ 이메일 또는 비밀번호가 일치하지 않습니다.");
        } else if (code === "DBE") {
          alert("🚨 서버 오류가 발생했습니다.");
        } else {
          alert(`❗ 오류: ${message}`);
        }
      } else {
        alert("⛔ 네트워크 오류 또는 서버가 응답하지 않습니다.");
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h2 style={styles.title}>로그인하기</h2>
        <p style={styles.subtitle}>학교 이메일 주소와 <br/>
        비밀번호를 입력해주세요</p>
      </div>
      <div style={styles.buttonContainer}>
        <input
          type="studentNum"
          placeholder="Enter your email"
          style={styles.input}
          value={studentNum}
          onChange={(e) => setStudentNum(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.forgotPassword}>Forgot Password?</button>
        <button style={styles.button} onClick={handleLogin}>로그인</button>
        <button style={styles.button} onClick={() => navigate("/join")}>회원가입</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minheight: "100vh",
    backgroundColor: "white",
    paddingTop: "10vh",
  },
  textContainer: {
    width: "80%",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "gray",
    marginBottom: "30px",
    lineHeight: "2",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "3rem",
  },
  input: {
    width: "250px",
    padding: "17px",
    marginBottom: "15px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  forgotPassword: {
    color: "#6a5af9",
    textDecoration: "none",
    marginBottom: "80px",
    border: "none",
    cursor: "pointer",
    background: "white"    
  },
  button: {
    width: "200px",
    padding: "15px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "15px",
    background: "#6a5af9",
    color: "white",
    cursor: "pointer",
    margin: "10px 0",
  },
};

export default Login;