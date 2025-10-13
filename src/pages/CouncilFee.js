import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import "./CouncilFee.css";

export default function CouncilFee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const department = localStorage.getItem("department"); // 예: "소프트웨어학과"

  // ✅ 학생회비 정보 불러오기
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.post("/mypage/council/check", { department },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          
        if (res.data.code === "SU" && Array.isArray(res.data.councilMembers)) {
          const mapped = res.data.councilMembers.map((m, index) => ({
            id: index + 1,
            name: m.name,
            studentNum: m.studentNum,
            department: m.department,
            isStudent: m.enrolled,
            councilFeePaid: m.councilPee,
          }));
          setStudents(mapped);
        } else {
          console.error("데이터 형식 오류:", res.data);
        }
      } catch (err) {
        console.error("학생회비 데이터 요청 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [department]);

  // ✅ 상태 변경 핸들러 (재학 여부 / 납부 여부)
  const handleStatusChange = async (studentNum, field) => {
    try {
      if (field === "isStudent") {
        await axios.post("/mypage/council/change-enroll", { studentNum });
      } else if (field === "councilFeePaid") {
        await axios.post("/mypage/council/change-council-pee", { studentNum });
      }

      // 프론트엔드 상태 즉시 반영
      setStudents(prev =>
        prev.map(s =>
          s.studentNum === studentNum
            ? { ...s, [field]: !s[field] }
            : s
        )
      );
    } catch (err) {
      console.error(`상태 변경 실패 (${field}):`, err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  // ✅ 검색 필터
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
              <div key={s.studentNum} className="userrow" style={{ cursor: "default" }}>
                <div className="userinfo">
                  <div className="username">
                    {s.name} ({s.studentNum})
                  </div>
                  <div className="userstatus">{s.department}</div>
                </div>
                <div className="actionbuttons">
                  {/* 재학 여부 버튼 */}
                  <button
                    className={s.isStudent ? "activebtn" : "inactivebtn"}
                    onClick={() => handleStatusChange(s.studentNum, "isStudent")}
                  >
                    {s.isStudent ? "재학생" : "휴학생"}
                  </button>

                  {/* 납부 여부 버튼 */}
                  <button
                    className={s.councilFeePaid ? "activebtn" : "inactivebtn"}
                    onClick={() => handleStatusChange(s.studentNum, "councilFeePaid")}
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
