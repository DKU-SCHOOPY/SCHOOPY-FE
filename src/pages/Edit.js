import { useState } from 'react';
import './Edit.css';

function Edit() {
  const [field, setField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = { field, newValue, reason };
    console.log('요청 전송:', request);
    alert('제출 완료');
  };

  return (
    <div className="container">
      <h2 className="page-title">개인정보 수정 요청</h2>

      <form className="edit-form" onSubmit={handleSubmit}>
        <label className="label">수정 항목</label>
        <select
          className="textarea"
          value={field}
          onChange={(e) => setField(e.target.value)}
          required
        >
          <option value="학과">학과</option>
          <option value="전화번호">전화번호</option>
        </select>

        <label className="label">변경 내용</label>
        <input
          className="textarea"
          type="text"
          placeholder="변경할 내용을 입력하세요"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          required
        />

        <label className="label">변경 사유</label>
        <textarea
          className="longtext"
          placeholder="변경 사유를 입력하세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button className="big-button" type="submit">제출하기</button>
      </form>
    </div>
  );
}

export default Edit;
