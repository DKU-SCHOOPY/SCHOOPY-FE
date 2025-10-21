import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";

export default function ExcelDownload({ eventCode }) {
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const headerMap = {
    studentNum: "학번",
    name: "이름",
    department: "학과",
    birthDay: "생년월일",
    gender: "성별",
    phoneNum: "전화번호",
    councilPee: "학생회비납부",
    enrolled: "재학상태",
  };

  useEffect(() => {
    const fetchExcelData = async () => {
      if (!eventCode) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/${eventCode}/export-data`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        setBaseHeaders(res.data.baseHeaders || []);
        setQuestionColumns(res.data.questions || []);
        setRows(res.data.rows || []);
      } catch (e) {
        console.error("엑셀 데이터 조회 오류:", e);
      }
    };

    fetchExcelData();
  }, [eventCode]);

  const exportExcel = () => {
    if (!rows.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    // 승인된 사람만 필터링
    const approvedRows = rows.filter(item => item.approved);

    const excelData = approvedRows.map((item) => {
      const row = {};

      // baseHeaders에 enrolled가 없으면 강제로 추가
      const headersToUse = [...baseHeaders];
      if (!headersToUse.includes("enrolled")) headersToUse.push("enrolled");

      headersToUse.forEach((header) => {
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
        } else if (header === "enrolled") {
          row[colName] = item.enrolled ? "재학생" : "휴학생";
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
    <button className="exceldown-btn" onClick={exportExcel}>
      엑셀다운
    </button>
  );
}
