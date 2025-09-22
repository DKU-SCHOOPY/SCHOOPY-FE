import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../config";
import "./ExcelList.css";

export default function ExcelList() {
  const { eventId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const departmentFilter = params.get("department");

  const [eventName, setEventName] = useState("");
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 신청자 데이터 불러오기 (실제 API 연동)
  useEffect(() => {
    async function fetchData() {
      if (!eventId) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/${eventId}/export-data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEventName(res.data.eventName || "");
        setBaseHeaders(res.data.baseHeaders || []);
        setQuestionColumns(res.data.questions || []);
        let rows = res.data.rows || [];
        // departmentFilter가 있으면 학과로 필터링
        if (departmentFilter) {
          rows = rows.filter((row) => row.department === departmentFilter);
        }
        setData(rows);
      } catch (e) {
        alert("데이터 조회 실패: " + (e.response?.data?.message || e.message));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId, departmentFilter]);

  // 엑셀로 내보내기
  const exportExcel = () => {
    if (!data.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = data.map((item) => {
      const row = {};
      baseHeaders.forEach((header) => {
        row[header] = item[header];
      });
      questionColumns.forEach((q, idx) => {
        row[q.questionText] = item.answers?.[idx] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "신청자목록");
    XLSX.writeFile(wb, `event_${eventId}_신청자목록.xlsx`);
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">{eventName}</h2>
      <div className="excel-controls">
        <button onClick={exportExcel} disabled={!data.length || loading}>
          엑셀로 내보내기
        </button>
      </div>
      <div>
        {loading ? (
          <div className="excel-nodata">불러오는 중...</div>
        ) : data.length > 0 ? (
          <table className="excel-table">
            <thead>
              <tr>
                {baseHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                {questionColumns.map((q) => (
                  <th key={q.questionId}>{q.questionText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  {baseHeaders.map((header) => (
                    <td key={header}>{item[header]}</td>
                  ))}
                  {questionColumns.map((q, qidx) => (
                    <td key={q.questionId}>
                      {item.answers?.[qidx] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="excel-nodata">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}