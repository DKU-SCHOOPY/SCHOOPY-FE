import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./StudentList.css"; // 스타일 분리 권장

export default function CouncilFee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  // 학생 데이터 불러오기 (가상)
  useEffect(() => {
    // TODO: 실제 API 요청으로 대체 예정
    const fakeData = [
      {
        id: 1,
        name: "김민수",
        studentNum: "20210001",
        department: "컴퓨터공학과",
        isStudent: true,
        councilFeePaid: false,
      },
      {
        id: 2,
        name: "이영희",
        studentNum: "20210002",
        department: "경영학과",
        isStudent: false,
        councilFeePaid: true,
      },
    ];
    setStudents(fakeData);
    setLoading(false);
  }, []);

  // 상태 변경 (재학여부 / 납부여부 토글)
  const handleStatusChange = (id, field) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [field]: !s[field] } : s
      )
    );
    // TODO: API 호출로 실제 상태 업데이트
    console.log(`학생 ${id}의 ${field} 상태 변경`);
  };

  const filteredStudents = students.filter(
    s =>
      s.name.includes(searchText) ||
      s.department.includes(searchText) ||
      s.studentNum.includes(searchText)
  );

  return (
    <div className="container">
      <Header title="학생회비 관리" showBack />

      <div className="searchbox">
        <input
          className="searchinput"
          type="text"
          placeholder="이름/학과/학번 검색"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <div className="userlist">
          {filteredStudents.length === 0 ? (
            <div className="noapplicants">학생이 없습니다.</div>
          ) : (
            filteredStudents.map(s => (
              <div
                key={s.id}
                className="userrow"
                style={{ cursor: "default" }}
              >
                <div className="userinfo">
                  <div className="username">
                    {s.name} ({s.studentNum})
                  </div>
                  <div className="userstatus">
                    {s.department}
                  </div>
                </div>
                <div className="actionbuttons">
                  {/* 재학 여부 버튼 */}
                  <button
                    className={s.isStudent ? "activebtn" : "inactivebtn"}
                    onClick={() => handleStatusChange(s.id, "isStudent")}
                  >
                    {s.isStudent ? "재학생" : "휴학생"}
                  </button>

                  {/* 납부 여부 버튼 */}
                  <button
                    className={s.councilFeePaid ? "activebtn" : "inactivebtn"}
                    onClick={() => handleStatusChange(s.id, "councilFeePaid")}
                  >
                    {s.councilFeePaid ? "납부" : "미납부"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
