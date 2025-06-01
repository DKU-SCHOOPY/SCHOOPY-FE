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
      "http://ec2-3-37-86-181.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
      { studentNum }
    );
    alert(`✅ ${response.data.message}`);
  } catch (error) {
    const message = error?.response?.data?.message || "네트워크 오류";
    alert(`❗ ${message}`);
  }
};

  const handleSendCertificationCode = async () => {
  try {
    const response = await axios.post(
      "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/email-certification",
      { studentNum }
    );
    alert(`✅ ${response.data.message}`);
  } catch (error) {
    const message = error?.response?.data?.message || "네트워크 오류";
    alert(`❗ ${message}`);
  }
};

  const handleCertificationCheck = async () => {
  try {
    const response = await axios.post(
      "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/auth/check-certification",
      { studentNum, certificationNumber }
    );
    alert(`✅ ${response.data.message}`);
    navigate("/login");
  } catch (error) {
    const message = error?.response?.data?.message || "네트워크 오류";
    alert(`❗ ${message}`);
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
    alert(`✅ ${response.data.message}`);
  } catch (error) {
    const message = error?.response?.data?.message || "네트워크 오류";
    alert(`❗ ${message}`);
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
