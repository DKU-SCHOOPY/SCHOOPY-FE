import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./CouncilFee.css";

export default function CouncilFee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  // ✅ 학생회비 관리 목록 불러오기
  useEffect(() => {
    const fetchCouncilStudents = async () => {
      try {
        const department = localStorage.getItem("department");

        const res = await axios.post(
          `${API_BASE_URL}/mypage/council/check`,
          { department },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("학생회비 관리 데이터:", res.data);

        if (res.data.code === "SU" && Array.isArray(res.data.councilMembers)) {
          // 서버에서 내려준 데이터에 상태값이 없다면 기본값 추가
          const mapped = res.data.councilMembers.map(member => ({
            ...member,
            isStudent: member.isStudent ?? true, // 기본값 true
            councilFeePaid: member.councilFeePaid ?? false, // 기본값 false
          }));
          setStudents(mapped);
        } else {
          console.warn("councilMembers 데이터 형식이 예상과 다름:", res.data);
          setStudents([]);
        }
      } catch (err) {
        console.error("학생 데이터 불러오기 실패:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCouncilStudents();
  }, []);

  // ✅ 상태 변경 함수 (재학 / 납부)
  const handleStatusChange = async (studentNum, field) => {
    try {
      // 프론트 상태 먼저 업데이트
      setStudents(prev =>
        prev.map(s =>
          s.studentNum === studentNum ? { ...s, [field]: !s[field] } : s
        )
      );

      // API 주소 분기
      let endpoint = "";
      if (field === "isStudent") {
        endpoint = `${API_BASE_URL}/mypage/council/change-enroll`;
      } else if (field === "councilFeePaid") {
        endpoint = `${API_BASE_URL}/mypage/council/change-council-pee`;
      }

      // 서버로 변경 요청
      await axios.post(
        endpoint,
        { studentNum },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(`${studentNum}의 ${field} 상태 변경 완료`);
    } catch (err) {
      console.error(`${studentNum}의 ${field} 상태 변경 실패:`, err);
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
                  {/* ✅ 재학 여부 버튼 */}
                  <button
                    className={s.isStudent ? "activebtn" : "inactivebtn"}
                    onClick={() => handleStatusChange(s.studentNum, "isStudent")}
                  >
                    {s.isStudent ? "재학생" : "휴학생"}
                  </button>

                  {/* ✅ 납부 여부 버튼 */}
                  <button
                    className={s.councilFeePaid ? "activebtn" : "inactivebtn"}
                    onClick={() =>
                      handleStatusChange(s.studentNum, "councilFeePaid")
                    }
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
