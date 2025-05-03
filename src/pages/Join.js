import React, { useState } from "react";
import axios from "axios";

function Join() {
  
  const [studentNum, setStudentNum] = useState("");

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-124-151-25.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-check",
        { studentNum: studentNum }
      );
  
      const { code, message } = response.data;
  
      if (code === "SU") {
        alert("✅ 사용 가능한 학번입니다.");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
  
        if (code === "DI") {
          alert("❌ 이미 사용 중인 학번입니다.");
        } else if (code === "VF") {
          alert("⚠️ 학번 입력이 유효하지 않습니다.");
        } else if (code === "DBE") {
          alert("🚨 서버에 오류가 발생했습니다.");
        } else {
          alert(`❗ 오류: ${message}`);
        }
      } else {
        alert("⛔ 네트워크 오류 또는 서버가 응답하지 않습니다.");
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleSendCertificationCode = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-124-151-25.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
        { studentNum }
      );
  
      const { code, message } = response.data;
  
      if (code === "SU") {
        alert("📧 인증코드가 이메일로 발송되었습니다.");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;
  
        if (code === "DI") {
          alert("❌ 이미 사용 중인 학번입니다.");
        } else if (code === "VF") {
          alert("⚠️ 학번 입력이 유효하지 않습니다.");
        } else if (code === "MF") {
          alert("🚨 메일 발송에 실패했습니다.");
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
  
  const handleCertificationCheck = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-124-151-25.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/check-certification",
        {
          studentNum,
          certificationNumber,
        }
      );

      const { code, message } = response.data;

      if (code === "SU") {
        alert("✅ 인증이 성공적으로 완료되었습니다.");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;

        if (code === "CF") {
          alert("❌ 인증에 실패했습니다.");
        } else if (code === "VF") {
          alert("⚠️ 입력값이 유효하지 않습니다.");
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
      <h2 style={styles.title}>회원가입</h2>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="학번"
          value={studentNum}
          onChange={(e) => setStudentNum(e.target.value)}
        />
        <button style={styles.outlinedButton} onClick={handleEmailCheck}>
          중복확인하기
        </button>
      </div>


      <div style={styles.inputRow}>
        <input style={styles.input} placeholder="인증코드 입력" />
      </div>

      <div style={styles.inputRow}>
        <button style={styles.outlinedButton} onClick={handleSendCertificationCode}>인증코드 발송</button>
        <button style={styles.outlinedButton} onClick={handleCertificationCheck}>인증코드 확인</button>
      </div>

      <div style={styles.inputRow}>
        <input style={styles.input} placeholder="이름" />
        <button style={styles.genderButton}>남성</button>
        <button style={styles.genderButton}>여성</button>
      </div>

      <div style={styles.inputRow}>
        <select style={styles.select}>
          <option>소프트웨어학과</option>
          <option>컴퓨터공학과</option>
          <option>사이버보안학과</option>
          <option>통계데이터사이언스학과</option>
        </select>
      </div>

      <div style={styles.inputRow}>
        <input style={styles.input} placeholder="생년월일 (YYYYMMDD)" />
      </div>

      <div style={styles.inputRow}>
        <input style={styles.input} placeholder="전화번호" />
      </div>

      <button style={styles.joinButton}>회원가입</button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "white",
    height: "100vh",
    boxSizing: "border-box",
    maxWidth: "400px",
    margin: "0 auto",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  inputRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    width: "100%",
  },
  input: {
    flex: "1",
    minWidth: "140px",
    padding: "15px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "15px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  outlinedButton: {
    padding: "15px 20px",
    borderRadius: "15px",
    border: "1px solid #6a5af9",
    backgroundColor: "white",
    color: "#6a5af9",
    fontWeight: "bold",
    cursor: "pointer",
  },
  genderButton: {
    padding: "15px 20px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    color: "black",
    cursor: "pointer",
  },
  joinButton: {
    marginTop: "10px",
    width: "90%",
    padding: "15px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    backgroundColor: "#6a5af9",
    color: "white",
    boxShadow: "0px 10px 20px rgba(106, 90, 249, 0.3)",
    cursor: "pointer",
    marginBottom: "20px"
  },
};

export default Join;
