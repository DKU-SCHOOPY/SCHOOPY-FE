import * as XLSX from "xlsx";

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

/**
 * 신청자 엑셀 파일 다운로드
 * @param {Array} rows - 신청자 데이터 rows
 * @param {Array} baseHeaders - 기본 헤더 배열
 * @param {Array} questionColumns - 폼 질문 배열
 * @param {string} eventCode - 행사 코드
 */
export function exportApplicantsExcel(rows, baseHeaders, questionColumns, eventCode) {
  if (!rows.length) {
    alert("내보낼 데이터가 없습니다.");
    return;
  }
  const excelData = rows.map((item) => {
    const row = {};
    baseHeaders.forEach((header) => {
      const colName = headerMap[header] || header;
      // 성별 한글 변환
      if (header === "gender") {
        row[colName] = item.gender === "female" ? "여자" : item.gender === "male" ? "남자" : item.gender;
      }
      // 학생회비납부 O/X 변환
      else if (header === "councilPee") {
        row[colName] = item.councilPee ? "O" : "X";
      }
      else {
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
  XLSX.writeFile(wb, `${res.data.eventName}_신청자목록.xlsx`);
}