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
  const [sortField, setSortField] = useState("name"); // 이름, 학과, 학번
  const [sortOrder, setSortOrder] = useState("asc"); // asc / desc

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

        if (res.data.code === "SU" && Array.isArray(res.data.councilMembers)) {
          const mappedStudents = res.data.councilMembers.map(m => ({
            studentNum: m.studentNum,
            name: m.name,
            department: m.department,
            isStudent: m.enrolled,
            councilFeePaid: m.councilPee,
          }));
          setStudents(mappedStudents);
        } else {
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

  const handleStatusChange = async (studentNum, field) => {
    try {
      setStudents(prev =>
        prev.map(s =>
          s.studentNum === studentNum ? { ...s, [field]: !s[field] } : s
        )
      );

      let endpoint = "";
      if (field === "isStudent") {
        endpoint = `${API_BASE_URL}/mypage/council/change-enroll`;
      } else if (field === "councilFeePaid") {
        endpoint = `${API_BASE_URL}/mypage/council/change-council-pee`;
      }

      await axios.post(
        endpoint,
        { studentNum },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error(`${studentNum}의 ${field} 상태 변경 실패:`, err);
    }
  };

  // ✅ 검색 필터 적용
  let filteredStudents = students.filter(
    s =>
      s.name.includes(searchText) ||
      s.department.includes(searchText) ||
      s.studentNum.includes(searchText)
  );

  // ✅ 정렬 적용
  filteredStudents.sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ 정렬 순서 토글 버튼
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  };

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

        {/* ✅ 정렬 컨트롤 */}
        <div className="sort-controls">
          <select
            className="sort-select"
            value={sortField}
            onChange={e => setSortField(e.target.value)}
          >
            <option value="name">이름</option>
            <option value="department">학과</option>
            <option value="studentNum">학번</option>
          </select>
          <button className="sort-btn" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? "▲ 오름차순" : "▼ 내림차순"}
          </button>
        </div>
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
                  <button
                    className={s.isStudent ? "activebtn" : "inactivebtn"}
                    onClick={() =>
                      handleStatusChange(s.studentNum, "isStudent")
                    }
                  >
                    {s.isStudent ? "재학생" : "휴학생"}
                  </button>

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
