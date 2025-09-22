import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";
import "./ExcelDownload.css"; // 필요하면 따로 스타일 작성

export default function ExcelDownload() {
  const { eventCode } = useParams();
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 한글 컬럼명 매핑
  const headerMap = {
    studentNum: "학번",
    name: "이름",
    department: "학과",
    birthDay: "생년월일",
    gender: "성별",
    phoneNum: "전화번호",
    councilPee: "학생회비납부",
  };

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/${eventCode}/export-data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setEventName(res.data.eventName || "");
        setBaseHeaders(res.data.baseHeaders || []);
        setQuestionColumns(res.data.questions || []);
        setRows(res.data.rows || []);
      } catch (e) {
        console.error("엑셀 데이터 조회 오류:", e);
        alert("엑셀 데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    if (eventCode) fetchExcelData();
    else setLoading(false);
  }, [eventCode]);

  const exportExcel = () => {
    if (!rows.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = rows.map((item) => {
      const row = {};
      baseHeaders.forEach((header) => {
        const colName = headerMap[header] || header;
        if (header === "gender") {
          row[colName] =
            item.gender === "female"
              ? "여자"
              : item.gender === "male"
              ? "남자"
              : item.gender;
        } else if (header === "councilPee") {
          row[colName] = item.councilPee ? "O" : "X";
        } else {
          row[colName] = item[header];
        }
      });
      questionColumns.forEach((q, idx) => {
        row[q.questionText] = item.answers?.[idx] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "신청자목록");
    XLSX.writeFile(wb, `event_${eventCode}_신청자목록.xlsx`);
  };

  return (
    <div className="excel-container">
      <div className="topbar">
        <button className="backbtn" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h2 className="title">{eventName || "엑셀 다운로드"}</h2>
        <div className="rightspace" />
      </div>

      {loading ? (
        <div>로딩중...</div>
      ) : (
        <div className="excel-content">
          <p>총 {rows.length}명의 신청자 데이터가 있습니다.</p>
          <button
            className="file-download-btn"
            onClick={exportExcel}
            disabled={!rows.length}
          >
            엑셀 다운로드
          </button>
        </div>
      )}
    </div>
  );
}
