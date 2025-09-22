import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_BASE_URL = "https://schoopy.co.kr";

export default function EventDetail({ eventCode }) {
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [baseHeaders, setBaseHeaders] = useState([]);
  const [questionColumns, setQuestionColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchEventData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/event/council/${eventCode}/export-data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEventName(res.data.eventName);
        setBaseHeaders(res.data.baseHeaders || []);
        setQuestionColumns(res.data.questions || []);
        setRows(res.data.rows || []);
      } catch (e) {
        alert("데이터 조회 실패: " + (e.response?.data?.message || e.message));
      } finally {
        setLoading(false);
      }
    }
    if (eventCode) fetchEventData();
  }, [eventCode]);

  // 엑셀로 내보내기
  const exportExcel = () => {
    if (!rows.length) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }
    const excelData = rows.map((item) => {
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
    XLSX.writeFile(wb, `event_${eventCode}_신청자목록.xlsx`);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>{eventName} 신청자 엑셀 다운로드</h2>
      <button onClick={exportExcel} disabled={loading || !rows.length}>
        엑셀로 내보내기
      </button>
      {loading ? (
        <div>불러오는 중...</div>
      ) : rows.length > 0 ? (
        <table border="1" cellPadding={6} style={{ marginTop: 24 }}>
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
            {rows.map((item, idx) => (
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
        <div style={{ marginTop: 24 }}>데이터가 없습니다.</div>
      )}
    </div>
  );
}