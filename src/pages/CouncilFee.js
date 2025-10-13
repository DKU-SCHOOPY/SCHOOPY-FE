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

  // ✅ 학생 리스트 불러오기
  useEffect(() => {
    const fetchCouncilStudents = async () => {
      try {
        const department = localStorage.getItem("department");
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${API_BASE_URL}/mypage/council/check`,
          { department },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("학생회비 관리 데이터:", res.data);

        // ✅ 실제 response key는 councilMembers
        if (res.data.code === "SU" && Array.isArray(res.data.councilMembers)) {
          // 프론트에서 사용할 필드명에 맞게 변환
          const mappedStudents = res.data.councilMembers.map(m => ({
            studentNum: m.studentNum,
            name: m.name,
            department: m.department,
            isStudent: m.enrolled, // enrolled → isStudent
            councilFeePaid: m.councilPee, // councilPee → councilFeePaid
          }));
          setStudents(mappedStudents);
        } else {
          console.warn("학생 데이터 형식이 올바르지 않음:", res.data);
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

  // ✅ 재학 여부 / 납부 여부 변경 핸들러
  const handleStatusChange = async (studentNum, field) => {
    try {
      // 프론트에서 먼저 토글 적용
      setStudents(prev =>
        prev.map(s =>
          s.studentNum === studentNum ? { ...s, [field]: !s[field] } : s
        )
      );

      // 변경할 API 엔드포인트 선택
      let endpoint = "";
      if (field === "isStudent") {
        endpoint = `${API_BASE_URL}/mypage/council/change-enroll`;
      } else if (field === "councilFeePaid") {
        endpoint = `${API_BASE_URL}/mypage/council/change-council-pee`;
      }

      // ✅ 서버로 상태 변경 요청
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
              <div
                key={s.studentNum}
                className="userrow"
                style={{ cursor: "default" }}
              >
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
                    onClick={() =>
                      handleStatusChange(s.studentNum, "isStudent")
                    }
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
