import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

export default function FormApplicants() {
  const navigate = useNavigate();
  const { eventCode } = useParams(); // URL에서 행사코드 추출 (예: /form-applicants/:eventCode)
  const [studentNum, setStudentNum] = useState("");
  const [department, setDepartment] = useState("소프트웨어학과");
  const [birth, setBirth] = useState({ year: "", month: "", day: "" });
  const [isStudent, setIsStudent] = useState(true);
  const [councilFeePaid, setCouncilFeePaid] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  // 신청하기
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/submit-survey",
        {
          studentNum,
          eventCode: Number(eventCode),
          isStudent,
          councilFeePaid,
          isPaymentCompleted
        },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("QR코드 페이지로 이동합니다.");
      // QR코드 URL로 리디렉션
      if (res.data.qrUrl) {
        window.location.href = res.data.qrUrl;
      }
    } catch (e) {
      alert("신청 실패: " + e.message);
    }
  };

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={() => navigate(-1)}>&larr;</BackBtn>
        <Title>새내기배움터</Title>
        <RightSpace />
      </TopBar>
      <BoardBtn>관련 게시판 보러가기</BoardBtn>
      <Notice>
        <span role="img" aria-label="heart">💗</span> 새내기 여러분의 설레는 첫 발걸음 <br />
        4년의 학교생활 중 단연코! 최고의 추억이 될 <br />
        새내기 배움터에 SW융합대학 학우 여러분을 초대합니다.
      </Notice>
      <Label>학번</Label>
      <Input
        value={studentNum}
        onChange={e => setStudentNum(e.target.value)}
        placeholder="학번을 입력하세요"
      />
      <Label>학과</Label>
      <Select value={department} onChange={e => setDepartment(e.target.value)}>
        <option value="소프트웨어학과">소프트웨어학과</option>
        <option value="컴퓨터공학과">컴퓨터공학과</option>
        <option value="정보통계학과">정보통계학과</option>
        <option value="사이버보안학과">사이버보안학과</option>
      </Select>
      <Label>생년월일</Label>
      <BirthRow>
        <BirthInput
          type="text"
          placeholder="2006"
          value={birth.year}
          onChange={e => setBirth({ ...birth, year: e.target.value })}
        />
        <span>년</span>
        <BirthInput
          type="text"
          placeholder="06"
          value={birth.month}
          onChange={e => setBirth({ ...birth, month: e.target.value })}
        />
        <span>월</span>
        <BirthInput
          type="text"
          placeholder="27"
          value={birth.day}
          onChange={e => setBirth({ ...birth, day: e.target.value })}
        />
        <span>일</span>
      </BirthRow>
      <PayRow>
        <PayBtn>토스로 송금하기</PayBtn>
        <PayBtn>카카오로 송금하기</PayBtn>
      </PayRow>
      <SubmitBtn onClick={handleSubmit}>신청하기</SubmitBtn>
    </Container>
  );
}

// 스타일
const Container = styled.div`
  padding: 0 16px 32px 16px;
  background: #fff;
  min-height: 100vh;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 18px 0;
`;
const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  width: 32px;
`;
const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
  flex: 1;
  text-align: center;
`;
const RightSpace = styled.div`
  width: 32px;
`;
const BoardBtn = styled.button`
  width: 100%;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  padding: 12px;
  color: #444;
  font-size: 15px;
  margin-bottom: 18px;
  cursor: pointer;
`;
const Notice = styled.div`
  background: #fafbfc;
  border-radius: 10px;
  padding: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 18px;
  text-align: left;
  line-height: 1.6;
`;
const Label = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 6px;
  margin-top: 18px;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  margin-bottom: 0;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  background: #fafbfc;
  margin-bottom: 0;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #a48cf0;
    background: #fff;
  }
`;
const BirthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
`;
const BirthInput = styled.input`
  width: 60px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: 15px;
`;
const PayRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
`;
const PayBtn = styled.button`
  flex: 1;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  padding: 12px 0;
  color: #444;
  font-size: 15px;
  cursor: pointer;
`;
const SubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #a48cf0 0%, #6c5ce7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 17px;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
`;
