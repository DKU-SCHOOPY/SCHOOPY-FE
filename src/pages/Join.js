import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate } from "react-router-dom";
import "./Join.css";
import { Check, X } from "lucide-react";

function Join() {
  const navigate = useNavigate();
  
  const [studentNum, setStudentNum] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [open, setOpen] = useState(false);


  const handleEmailCheck = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/email-check`,
      { studentNum }
    );
    alert(`✅ 사용 가능한 학번입니다.`);
  } catch (error) {
    const message = error?.response?.data?.message || "학번 중복 확인 오류";
    alert(`❗ ${message}`);
  }
};

  const handleSendCertificationCode = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/email-certification`,
      { studentNum }
    );
    alert(`✅ 발송 완료(스팸메일함도 확인해주세요)`);
  } catch (error) {
    const message = error?.response?.data?.message || "네트워크 오류";
    alert(`❗ ${message}`);
  }
};

  const handleCertificationCheck = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/check-certification`,
      { studentNum, certificationNumber }
    );
    alert(`✅ 인증 완료`);
    
  } catch (error) {
    const message = error?.response?.data?.message || "인증 오류";
    alert(`❗ ${message}`);
  }
};

  const isMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;


  const handleJoin = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/sign-up`,
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
    alert(`✅ 회원가입 성공! 로그인 페이지로 이동합니다.`);
    navigate("/login");
  } catch (error) {
    const code = error?.response?.data?.code;
    const serverMessage = error?.response?.data?.message;

    // 🔹 IR 코드 처리
    if (code === "IR") {
      alert("❗ 양식이 올바르지 않습니다. 학번:숫자8자리, 비밀번호:영문+숫자+특수문자 8~20자리");
      return;
    }

    // 🔹 그 외 기본 처리
    const message = serverMessage || "네트워크 오류";
    alert(`❗ ${message}`);
  }
};

  return (
    <div className="container">
      <h2 className="page-title">회원가입</h2>

      <div className="input-row">
        <input
          className="textarea"
          placeholder="학번"
          value={studentNum}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="8"
          onChange={(e) => {
            // 🔹 숫자만 남기고, 8자리까지만 허용
            const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
            setStudentNum(onlyNums);
          }}
        />
        <button className="join-outline-btn" onClick={handleEmailCheck}>
          중복확인하기
        </button>
      </div>

      <div className="input-row">
        <button className="join-outline-btn" onClick={handleSendCertificationCode}>인증코드 발송</button>

      </div>

      <div className="input-row">
        <input className="textarea" placeholder="인증코드 입력" value={certificationNumber}
          maxLength={8}
          onChange={(e) => {
            const onlyId = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
            setCertificationNumber(onlyId);
          }} />
        <button className="join-outline-btn" onClick={handleCertificationCheck}>인증코드 확인</button>
      </div>

      <div className="input-row">
        <input className="textarea" placeholder="비밀번호 영문+숫자+특수문자 8~20자리" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="input-row"> {/* <-- CSS에서 position: relative 설정 필요 */}
        <input
          className="textarea with-icon"
          placeholder="비밀번호 재확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {confirmPassword.length > 0 && isMatch && (
          <Check className="input-icon success" size={18} />
        )}
        {confirmPassword.length > 0 && isMismatch && (
          <X className="input-icon error" size={18} />
        )}
      </div>


      <div className="input-row">
        <input className="textarea" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={`gender-btn ${gender === "male" ? "selected" : ""}`} onClick={() => setGender("male")}>남성</button>
        <button className={`gender-btn ${gender === "female" ? "selected" : ""}`} onClick={() => setGender("female")}>여성</button>
      </div>

      <div className="input-row">
        <div className="dropdown">
          <div className="dropdown-selected" onClick={() => setOpen(!open)}>
            {department || "학과 선택"}
            <span className="arrow">{open ? "▲" : "▼"}</span>
          </div>

          {open && (
            <div className="dropdown-menu">
              {["소프트웨어학과", "컴퓨터공학과", "사이버보안학과", "통계데이터사이언스학과"].map((dept) => (
                <div
                  key={dept}
                  className={`dropdown-item ${department === dept ? "selected" : ""}`}
                  onClick={() => {
                    setDepartment(dept);
                    setOpen(false);
                  }}
                >
                  {dept}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="input-row">
        <input className="textarea" placeholder="생년월일 (YYYYMMDD)" value={birthDay} 
        maxLength={8}
          onChange={(e) => {
            const onlyBirth = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
            setBirthDay(onlyBirth);
          }}
        />
      </div>

      <div className="input-row">
        <input
          className="textarea"
          placeholder="전화번호"
          value={phoneNum}
          maxLength={11}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
            setPhoneNum(onlyNums);
          }}
        />
      </div>

      <button className="big-button" onClick={handleJoin}>회원가입</button>
    </div>
  );
}

export default Join;
