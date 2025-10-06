import { useState } from 'react';
import axios from 'axios';
import './Edit.css';
import Header from "../components/Header";
import { API_BASE_URL } from "../config";

function Edit() {
  const [field, setField] = useState('');
  const [newValue, setNewValue] = useState('');

  const studentNum = localStorage.getItem('studentNum');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("제출 이벤트 발생!");
    try {
      let response;
      console.log("axios 요청 직전");

      if (field === "학과") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-dept`, {
          studentNum,
          department: newValue,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "전화번호") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-phone-num`, {
          studentNum,
          phoneNum: newValue,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "재학여부") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-enrollment`, {
          studentNum,
          status: newValue,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "학생회비납부여부") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-dues`, {
          studentNum,
          duesStatus: newValue,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {
        alert("잘못된 항목입니다.");
        return;
      }

      if (response.data.code === "SU") {
        alert("✅ 제출 완료");
      } else {
        alert("❗ 요청 실패: " + response.data.message);
      }

    } catch (error) {
      console.error("요청 에러:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  // 조건별 입력 UI
  const renderInputField = () => {
    switch (field) {
      case "학과":
        return (
          <select
            className="textarea"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            required
          >
            <option value="">학과 선택</option>
            <option value="소프트웨어학과">소프트웨어학과</option>
            <option value="컴퓨터공학과">컴퓨터공학과</option>
            <option value="사이버보안학과">사이버보안학과</option>
            <option value="통계데이터사이언스학과">통계데이터사이언스학과</option>
          </select>
        );

      case "전화번호":
        return (
          <input
            className="textarea"
            type="text"
            placeholder="숫자만 입력 (최대 11자리)"
            value={newValue}
            maxLength={11}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
              setNewValue(onlyNums);
            }}
            required
          />
        );

      case "재학여부":
        return (
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${newValue === "재학생" ? "selected" : ""}`}
              onClick={() => setNewValue("재학생")}
            >
              재학생
            </button>
            <button
              type="button"
              className={`toggle-btn ${newValue === "휴학생" ? "selected" : ""}`}
              onClick={() => setNewValue("휴학생")}
            >
              휴학생
            </button>
          </div>
        );

      case "학생회비납부여부":
        return (
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${newValue === "납부" ? "selected" : ""}`}
              onClick={() => setNewValue("납부")}
            >
              납부
            </button>
            <button
              type="button"
              className={`toggle-btn ${newValue === "미납부" ? "selected" : ""}`}
              onClick={() => setNewValue("미납부")}
            >
              미납부
            </button>
          </div>
        );

      default:
        return (
          <input
            className="textarea"
            type="text"
            placeholder="변경할 내용을 입력하세요"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            required
          />
        );
    }
  };

  return (
    <div className="container">
      <Header title="개인정보 수정" showBack />
      
      <form className="edit-form" onSubmit={handleSubmit}>
        <label className="label">수정 항목</label>
        <select
          className="textarea"
          value={field}
          onChange={(e) => {
            setField(e.target.value);
            setNewValue(""); // 항목 변경 시 입력값 초기화
          }}
          required
        >
          <option value="">선택하세요</option>
          <option value="학과">학과</option>
          <option value="전화번호">전화번호</option>
          <option value="재학여부">재학 여부</option>
          <option value="학생회비납부여부">학생회비 납부 여부</option>
        </select>

        <label className="label">변경 내용</label>
        {renderInputField()}

        <button className="big-button" type="submit">제출하기</button>
      </form>
    </div>
  );
}

export default Edit;
