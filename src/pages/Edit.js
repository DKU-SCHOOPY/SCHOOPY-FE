import { useState } from 'react';
import axios from 'axios';
import './Edit.css';
import Header from "../components/Header";
import { API_BASE_URL } from "../config";

function Edit() {
  const [field, setField] = useState('');
  const [newValue, setNewValue] = useState('');

  // 🔹 드롭다운 상태 추가
  const [open, setOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [fieldOpen, setFieldOpen] = useState(false);


  const studentNum = localStorage.getItem('studentNum');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("제출 이벤트 발생!");
    try {
      let response;
      console.log("axios 요청 직전");

      if (field === "학과") {
        response = await axios.post(`${API_BASE_URL}/mypage/student/change-dept`, {
          studentNum,
          department: selectedDept, // ✅ newValue 대신 selectedDept 사용
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "전화번호") {
        response = await axios.post(`${API_BASE_URL}/mypage/student/change-phone-num`, {
          studentNum,
          phoneNum: newValue,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "재학여부") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-enroll`, {
          studentNum
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (field === "학생회비납부여부") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-council-pee`, {
          studentNum
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

  // 🔹 조건별 입력 UI
  const renderInputField = () => {
    switch (field) {
      case "학과":
        return (
          <div className="dropdown">
            <div className="dropdown-selected" onClick={() => setOpen(!open)}>
              {selectedDept || "학과 선택"}
              <span className="arrow">{open ? "▲" : "▼"}</span>
            </div>
            {open && (
              <div className="dropdown-menu">
                {["소프트웨어학과", "컴퓨터공학과", "사이버보안학과", "통계데이터사이언스학과"].map((dept) => (
                  <div
                    key={dept}
                    className={`dropdown-item ${selectedDept === dept ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedDept(dept);
                      setOpen(false);
                    }}
                  >
                    {dept}
                  </div>
                ))}
              </div>
            )}
          </div>
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
        <div className="dropdown">
          <div
            className="dropdown-selected"
            onClick={() => setFieldOpen(!fieldOpen)}
          >
            {field || "선택하세요"}
            <span className="arrow">{fieldOpen ? "▲" : "▼"}</span>
          </div>

          {fieldOpen && (
            <div className="dropdown-menu">
              {["학과", "전화번호", "재학여부", "학생회비납부여부"].map((option) => (
                <div
                  key={option}
                  className={`dropdown-item ${field === option ? "selected" : ""}`}
                  onClick={() => {
                    setField(option);
                    setNewValue("");
                    setSelectedDept("");
                    setFieldOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="label">변경 내용</label>
        {renderInputField()}

        <button className="big-button" type="submit">
          제출하기
        </button>
      </form>
    </div>
  );
}

export default Edit;
