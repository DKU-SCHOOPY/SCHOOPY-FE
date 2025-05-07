import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Join.css";

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

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
        { studentNum }
      );

      const { code, message } = response.data;
      if (code === "SU") alert("✅ 사용 가능한 학번입니다.");
      else alert(`⚠️ ${message}`);
    } catch (error) {
      const { code, message } = error?.response?.data || {};
      if (code === "DI") alert("❌ 이미 사용 중인 학번입니다.");
      else if (code === "VF") alert("⚠️ 학번 입력이 유효하지 않습니다.");
      else if (code === "DBE") alert("🚨 서버에 오류가 발생했습니다.");
      else alert(`❗ 오류: ${message || "네트워크 오류"}`);
    }
  };

  const handleSendCertificationCode = async () => {
    try {
      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
        { studentNum }
      );
      const { code, message } = response.data;
      if (code === "SU") alert("📧 인증코드가 이메일로 발송되었습니다.");
      else alert(`⚠️ ${message}`);
    } catch (error) {
      const { code, message } = error?.response?.data || {};
      if (code === "DI") alert("❌ 이미 사용 중인 학번입니다.");
      else if (code === "VF") alert("⚠️ 학번 입력이 유효하지 않습니다.");
      else if (code === "MF") alert("🚨 메일 발송에 실패했습니다.");
      else if (code === "DBE") alert("🚨 서버 오류가 발생했습니다.");
      else alert(`❗ 오류: ${message || "네트워크 오류"}`);
    }
  };

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
      } else alert(`⚠️ ${message}`);
    } catch (error) {
      const { code, message } = error?.response?.data || {};
      if (code === "CF") alert("❌ 인증에 실패했습니다.");
      else if (code === "VF") alert("⚠️ 입력값이 유효하지 않습니다.");
      else if (code === "DBE") alert("🚨 서버 오류가 발생했습니다.");
      else alert(`❗ 오류: ${message || "네트워크 오류"}`);
    }
  };

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
      if (code === "SU") alert("🎉 회원가입이 완료되었습니다!");
      else alert(`⚠️ ${message}`);
    } catch (error) {
      const { code, message } = error?.response?.data || {};
      if (code === "DI") alert("❌ 이미 가입된 학번입니다.");
      else if (code === "VF") alert("⚠️ 입력값이 유효하지 않습니다.");
      else if (code === "CF") alert("❌ 인증되지 않은 사용자입니다.");
      else if (code === "DBE") alert("🚨 서버 오류가 발생했습니다.");
      else alert(`❗ 오류: ${message || "네트워크 오류"}`);
    }
  };

  return (
    <div className="join-container">
      <h2 className="join-title">회원가입</h2>

      <div className="input-row">
        <input className="join-input" placeholder="학번" value={studentNum} onChange={(e) => setStudentNum(e.target.value)} />
        <button className="join-outline-btn" onClick={handleEmailCheck}>중복확인하기</button>
      </div>

      <div className="input-row">
        <input className="join-input" placeholder="인증코드 입력" value={certificationNumber} onChange={(e) => setCertificationNumber(e.target.value)} />
      </div>

      <div className="input-row">
        <button className="join-outline-btn" onClick={handleSendCertificationCode}>인증코드 발송</button>
        <button className="join-outline-btn" onClick={handleCertificationCheck}>인증코드 확인</button>
      </div>

      <div className="input-row">
        <input className="join-input" placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="input-row">
        <input className="join-input" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={`gender-btn ${gender === "male" ? "selected" : ""}`} onClick={() => setGender("male")}>남성</button>
        <button className={`gender-btn ${gender === "female" ? "selected" : ""}`} onClick={() => setGender("female")}>여성</button>
      </div>

      <div className="input-row">
        <select className="join-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="software">소프트웨어학과</option>
          <option value="computer">컴퓨터공학과</option>
          <option value="cyber">사이버보안학과</option>
          <option value="data">통계데이터사이언스학과</option>
        </select>
      </div>

      <div className="input-row">
        <input className="join-input" placeholder="생년월일 (YYYYMMDD)" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} />
      </div>

      <div className="input-row">
        <input className="join-input" placeholder="전화번호" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
      </div>

      <button className="join-main-btn" onClick={handleJoin}>회원가입</button>
    </div>
  );
}

export default Join;
