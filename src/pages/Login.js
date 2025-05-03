import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h2 style={styles.title}>로그인하기</h2>
        <p style={styles.subtitle}>학교 이메일 주소와 <br/>
        비밀번호를 입력해주세요</p>
      </div>
      <div style={styles.buttonContainer}>
        <input type="email" placeholder="Enter your email" style={styles.input} />
        <input type="password" placeholder="Enter your password" style={styles.input} />
        <button style={styles.forgotPassword}>Forgot Password?</button>
        <button style={styles.button}>로그인</button>
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