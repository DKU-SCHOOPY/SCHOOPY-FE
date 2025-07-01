import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import "./Form.css"; // 분리된 CSS 파일 불러오기

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
  const [studentNum] = useState("32220573"); // 하드코딩된 studentNum

  // useEffect(() => {
  //   // 행사 정보 조회
  //   const fetchEventData = async () => {
  //     if (!eventCode) {
  //       console.error("No eventCode found in URL");
  //       return;
  //     }

  //     try {
  //       console.log("Fetching event data for code:", eventCode);
  //       const response = await axios.get(
  //         `${API_BASE_URL}/event/${eventCode}`
  //       );
  //       if (response.data.statusCode === "OK") {
  //         console.log("Event Data:", response.data.data);
  //         setEventData(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching event data:", error);
  //     }
  //   };

  //   fetchEventData();
  // }, [eventCode]);

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

  // const handlePayment = async (remitType) => {
  //   try {
  //     // remitType을 대문자로 변환
  //     const formattedRemitType = remitType === "toss" ? "TOSS" : "KAKAOPAY";

  //     const requestData = {
  //       studentNum: studentNum,
  //       eventCode: parseInt(eventCode),
  //       remitType: formattedRemitType
  //     };

  //     console.log("Payment Request Data:", requestData); // 요청 데이터 로깅

  //     const response = await axios.post(
  //       `${API_BASE_URL}/event/remit-redirect`,
  //       requestData
  //     );

  //     console.log("Payment Response:", response.data);

  //     if (response.data.statusCode === "OK" && response.data.body.url) {
      
  //       const paymentUrl = response.data.body.url;

  //       // 토스든 카카오페이든 API에서 받은 URL을 새 탭에서 엽니다.
  //       // API 응답 URL이 웹/앱 환경을 모두 처리하도록 설계되어 있어야 합니다.
  //       //window.open(paymentUrl, '_blank');
  //       const deeplink = paymentUrl.replace("https://qr.kakaopay.com/", "kakaotalk://kakaopay/money/to/qr?qr_code=");
        
  //       window.location.href = deeplink;
  //       //const go = window.confirm("카카오톡으로 이동할까요?");

  //       // 딥링크 처리는 API 응답 URL 자체에 포함되어 있거나
  //       // API 호출 전에 환경을 판단하여 다른 API를 호출하는 방식으로 구현될 수 있습니다.
  //       // 현재는 API 응답 URL을 직접 엽니다.

  //       setFormData(prev => ({
  //         ...prev,
  //         councilFeePaid: true
  //       }));
  //     } else {
  //       console.error("Invalid response format:", response.data);
  //       alert("송금 URL을 가져오는데 실패했습니다.");
  //     }
  //   } catch (error) {
  //     console.error("Error getting payment URL:", error.response || error);
  //     alert("송금 URL을 가져오는데 실패했습니다: " + (error.response?.data?.message || error.message));
  //   }
  // };

  const handlePayment = async (remitType) => {
  try {
    const formattedRemitType = remitType === "toss" ? "TOSS" : "KAKAOPAY";

    const requestData = {
      studentNum: studentNum,
      eventCode: parseInt(eventCode),
      remitType: formattedRemitType
    };

    const response = await axios.post(
      `${API_BASE_URL}/event/remit-redirect`,
      requestData
    );

    if (response.data.statusCode === "OK" && response.data.body.url) {
      const paymentUrl = response.data.body.url;

      if (remitType === "toss") {
        // 토스 링크 처리
        if (paymentUrl.startsWith("supertoss://") || paymentUrl.startsWith("https://toss.me/")) {
          window.location.href = paymentUrl;
        } else {
          alert("유효한 토스 송금 링크가 아닙니다.");
        }
      } else if (remitType === "kakaopay") {
        // 카카오페이 링크 → 딥링크 변환
        const deeplink = paymentUrl.replace(
          "https://qr.kakaopay.com/",
          "kakaotalk://kakaopay/money/to/qr?qr_code="
        );
        window.location.href = deeplink;
      }

      // 송금 상태 저장
      setFormData(prev => ({
        ...prev,
        councilFeePaid: true
      }));

    } else {
      alert("송금 URL을 가져오는데 실패했습니다.");
    }
  } catch (error) {
    alert("송금 URL을 가져오는데 실패했습니다: " + (error.response?.data?.message || error.message));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/event/application`,
        {
          studentNum: studentNum,
          eventCode: parseInt(eventCode),
          isStudent: false,
          councilFeePaid: false,
          isPaymentCompleted: false
        }
      );
      console.log("신청하기",response.data.statusCode);

      if (response.data.statusCode === "OK") {
        alert("신청이 완료되었습니다!");
        navigate("/home");
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
    <div className="container">
      <h2 className="page-title">행사 신청</h2>
      <p className="form-description">아래 항목을 작성하여 신청해 주세요.</p>

      <form onSubmit={handleSubmit}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isStudent"
            checked={formData.isStudent}
            onChange={handleInputChange}
          />
          재학생입니다
        </label>

        <div className="button-group">
          <button
            type="button"
            className={`payment-button toss ${formData.councilFeePaid ? "disabled" : ""}`}
            onClick={() => handlePayment("toss")}
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "토스로 송금하기"}
          </button>

          <button
            type="button"
            className={`payment-button kakao ${formData.councilFeePaid ? "disabled" : ""}`}
            onClick={() => handlePayment("kakaopay")}
            disabled={formData.councilFeePaid}
          >
            {formData.councilFeePaid ? "송금 완료" : "카카오페이로 송금하기"}
          </button>
        </div>

        <button
          type="submit"
          className="big-button"
          disabled={!formData.councilFeePaid}
        >
          {formData.councilFeePaid ? "신청하기" : "송금 후 신청 가능"}
        </button>
      </form>
    </div>
  );
};

export default Form;
