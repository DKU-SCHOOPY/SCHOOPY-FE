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
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        console.log("axios 요청 후, 응답:", response);
      } else if (field === "전화번호") {
        response = await axios.post(`${API_BASE_URL}/mypage/change-phone-num`, {
          studentNum,
          phoneNum: newValue,
        },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
        console.log("axios 요청 후, 응답:", response);
      } else {
        console.error("axios 요청 에러", e);
        alert("잘못된 항목입니다.");
        return;
      }

      if (response.data.code === "SU") {
        console.log("응답 데이터:", response.data);
        alert("제출 완료");
      } else {
        alert("요청 실패: " + response.data.message);
      }

    } catch (error) {
      console.error("요청 에러:", error);
      alert("요청 중 오류가 발생했습니다.");
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
          onChange={(e) => setField(e.target.value)}
          required
        >
          <option value="">선택하세요</option>
          <option value="학과">학과</option>
          <option value="전화번호">전화번호</option>
        </select>

        <label className="label">변경 내용</label>
        <input
          className="textarea"
          type="text"
          placeholder="변경할 내용을 입력하세요"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          required
        />

        {/* <label className="label">변경 사유</label>
        <textarea
          className="longtext"
          placeholder="변경 사유를 입력하세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        /> */}

        <button className="big-button" type="submit">제출하기</button>
      </form>
    </div>
  );
}

export default Edit;
