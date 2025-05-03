import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




function Join() {
  const navigate = useNavigate();
  
  const [studentNum, setStudentNum] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("software");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  /* 학번 중복 확인 */
  const handleEmailCheck = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
        { studentNum }
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
      }
    }
  };

  /* 이메일 인증코드 전송 */
  const handleSendCertificationCode = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
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
      }
    }
  };

  /* 인증코드 확인 */
  const handleCertificationCheck = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/check-certification",
        { studentNum, certificationNumber }
      );

      const { code, message } = response.data;

      if (code === "SU") {
        alert("✅ 인증이 성공적으로 완료되었습니다.");
        navigate("/login");
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
      }
    }
  };

  /* 회원가입 */
  const handleJoin = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/sign-up",
        {
          studentNum,
          password,
          name,
          certificationNumber,
          department,
          gender,
          birthDay,
          phoneNum,
        }
      );

      const { code, message } = response.data;

      if (code === "SU") {
        alert("🎉 회원가입이 완료되었습니다!");
      } else {
        alert(`⚠️ ${message}`);
      }
    } catch (error) {
      if (error.response) {
        const { code, message } = error.response.data;

        if (code === "DI") {
          alert("❌ 이미 가입된 학번입니다.");
        } else if (code === "VF") {
          alert("⚠️ 입력값이 유효하지 않습니다.");
        } else if (code === "CF") {
          alert("❌ 인증되지 않은 사용자입니다.");
        } else if (code === "DBE") {
          alert("🚨 서버 오류가 발생했습니다.");
        } else {
          alert(`❗ 오류: ${message}`);
        }
      } else {
        alert("⛔ 네트워크 오류 또는 서버가 응답하지 않습니다.");
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
        <input
          style={styles.input}
          placeholder="인증코드 입력"
          value={certificationNumber}
          onChange={(e) => setCertificationNumber(e.target.value)}
        />
      </div>

      <div style={styles.inputRow}>
        <button style={styles.outlinedButton} onClick={handleSendCertificationCode}>
          인증코드 발송
        </button>
        <button style={styles.outlinedButton} onClick={handleCertificationCheck}>
          인증코드 확인
        </button>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          style={styles.genderButton(gender === "male")}
          onClick={() => setGender("male")}
        >
          남성
        </button>
        <button
          style={styles.genderButton(gender === "female")}
          onClick={() => setGender("female")}
        >
          여성
        </button>
      </div>

      <div style={styles.inputRow}>
        <select
          style={styles.select}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="software">소프트웨어학과</option>
          <option value="computer">컴퓨터공학과</option>
          <option value="cyber">사이버보안학과</option>
          <option value="data">통계데이터사이언스학과</option>
        </select>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="생년월일 (YYYYMMDD)"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
        />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="전화번호"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
        />
      </div>

      <button style={styles.joinButton} onClick={handleJoin}>
        회원가입
      </button>
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
  genderButton: (selected) => ({
    padding: "15px 20px",
    border: "1px solid #6200ee",
    borderRadius: "15px",
    cursor: "pointer",
    backgroundColor: selected ? "#6200ee" : "white",
    color: selected ? "white" : "#6200ee",
  }),
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
