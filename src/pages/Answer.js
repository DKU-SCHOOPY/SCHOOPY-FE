import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Answer.css";

function AnswerPage() {
  const { applicationId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/schoopy/v1/event/application/${applicationId}/answer`)
      .then(res => {
        setAnswers(res.data);
        setLoading(false);
      });
  }, [applicationId]);

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="container">
      <h2 className="page-title">신청 응답 내용</h2>
      <div className="answer-list">
        {answers.map((a, idx) => (
          <div className="answer-block" key={a.questionId}>
            <div className="question">{idx + 1}. {a.questionText}</div>
            <div className="answer">
              {a.answerText
                ? <span>{a.answerText}</span>
                : a.answerList && a.answerList.length > 0
                  ? <ul>{a.answerList.map((ans, i) => <li key={i}>{ans}</li>)}</ul>
                  : <span style={{ color: "#aaa" }}>응답 없음</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnswerPage;
