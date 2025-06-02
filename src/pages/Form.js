import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Form = () => {
  const navigate = useNavigate();
  const { eventCode } = useParams();

  console.log("Current URL params:", useParams()); // 전체 URL 파라미터 확인
  console.log("URL eventCode:", eventCode); // eventCode 값 확인

  const [formData, setFormData] = useState({
    isStudent: false,
    councilFeePaid: false,
    isPaymentCompleted: false
  });

  const [eventData, setEventData] = useState(null);
  const [errors, setErrors] = useState({});
  const [studentNum] = useState("32203027"); // 하드코딩된 studentNum

  useEffect(() => {
    // 행사 정보 조회
    const fetchEventData = async () => {
      if (!eventCode) {
        console.error("No eventCode found in URL");
        return;
      }

      try {
        console.log("Fetching event data for code:", eventCode);
        const response = await axios.get(
          `http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/${eventCode}`
        );
        if (response.data.statusCode === "OK") {
          console.log("Event Data:", response.data.data);
          setEventData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [eventCode]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePayment = async (remitType) => {
    try {
      // remitType을 대문자로 변환
      const formattedRemitType = remitType === "toss" ? "TOSS" : "KAKAO";

      const requestData = {
        studentNum: studentNum,
        eventCode: parseInt(eventCode),
        remitType: formattedRemitType
      };

      console.log("Payment Request Data:", requestData); // 요청 데이터 로깅

      const response = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/remit-redirect",
        requestData
      );

      console.log("Payment Response:", response.data);

      if (response.data.statusCode === "OK" && response.data.body.url) {
        const paymentUrl = response.data.body.url;

        // 토스든 카카오페이든 API에서 받은 URL을 새 탭에서 엽니다.
        // API 응답 URL이 웹/앱 환경을 모두 처리하도록 설계되어 있어야 합니다.
        window.open(paymentUrl, '_blank');

        // 딥링크 처리는 API 응답 URL 자체에 포함되어 있거나
        // API 호출 전에 환경을 판단하여 다른 API를 호출하는 방식으로 구현될 수 있습니다.
        // 현재는 API 응답 URL을 직접 엽니다.

        setFormData(prev => ({
          ...prev,
          councilFeePaid: true
        }));
      } else {
        console.error("Invalid response format:", response.data);
        alert("송금 URL을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error getting payment URL:", error.response || error);
      alert("송금 URL을 가져오는데 실패했습니다: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/application",
        {
          studentNum: studentNum,
          eventCode: parseInt(eventCode),
          isStudent: formData.isStudent,
          councilFeePaid: false,
          isPaymentCompleted: false
        }
      );

      if (response.data.statusCode === "OK") {
        alert("신청이 완료되었습니다!");
        navigate("/formlist");
      } else {
        alert("신청에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("신청 중 오류가 발생했습니다: " + error.message);
    }
  };

  // QR 코드가 있는지 확인하는 함수
  const hasQrCode = () => {
    if (!eventData) return false;
    return eventData.qr_toss_x || eventData.qr_kakaopay_x;
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Header>행사 신청</Header>
        <Description>아래 항목을 작성하여 신청해 주세요.</Description>

        <CheckboxContainer>
          <Label>
            <input
              type="checkbox"
              name="isStudent"
              checked={formData.isStudent}
              onChange={handleInputChange}
            />
            재학생입니다
          </Label>
        </CheckboxContainer>

        <PaymentSection>
          <PaymentButton
            type="button"
            onClick={() => handlePayment("toss")}
            primary
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "토스로 송금하기"}
          </PaymentButton>
          <PaymentButton
            type="button"
            onClick={() => handlePayment("kakaopay")}
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "카카오페이로 송금하기"}
          </PaymentButton>
        </PaymentSection>

        <SubmitButton
          type="submit"
          disabled={!formData.councilFeePaid}
        >
          {formData.councilFeePaid ? "신청하기" : "송금 후 신청 가능"}
        </SubmitButton>
      </FormContainer>
    </Container>
  );
};

export default Form;

// 스타일 컴포넌트
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const CheckboxContainer = styled.div`
  margin: 10px 0;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

const InputContainer = styled.div`
  margin: 10px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.disabled ? '#E0E0E0' : '#6c5ce7'};
  color: ${props => props.disabled ? '#666666' : 'white'};
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background: ${props => props.disabled ? '#E0E0E0' : '#5b4bc4'};
  }
`;

const PaymentSection = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const PaymentButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background: ${props => {
    if (props.disabled) return '#E0E0E0';
    return props.primary ? '#0064FF' : '#FEE500';
  }};
  color: ${props => {
    if (props.disabled) return '#666666';
    return props.primary ? 'white' : '#000000';
  }};

  &:hover {
    background: ${props => {
    if (props.disabled) return '#E0E0E0';
    return props.primary ? '#0052CC' : '#F4DC00';
  }};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
