import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from "axios";
import { useDrag, useDrop } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import jsQR from 'jsqr';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRefs = {
    tossUnpaid: useRef(null),
    tossPaid: useRef(null),
    kakaoUnpaid: useRef(null),
    kakaoPaid: useRef(null)
  };

  // 폼 생성 데이터
  const [formData, setFormData] = useState({
    eventName: "",
    department: "",
    surveyStartDate: null,
    surveyEndDate: null,
    eventStartDate: null,
    eventEndDate: null,
    maxParticipants: "",
    currentParticipants: "0",
    eventDescription: "",
    qrCodeImages: {
      qr_toss_x: "",  // 미입금자 토스 QR
      qr_toss_o: "",  // 입금자 토스 QR
      qr_kakaopay_x: "",  // 미입금자 카카오페이 QR
      qr_kakaopay_o: ""   // 입금자 카카오페이 QR
    }
  });

  useEffect(() => {
    // CreatePost에서 전달받은 데이터가 있다면 설정
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        eventName: location.state.eventName || "",
        department: location.state.department || "",
        eventDescription: location.state.eventDescription || ""
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleQrImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setFormData(prev => ({
              ...prev,
              qrCodeImages: {
                ...prev.qrCodeImages,
                [type]: code.data
              }
            }));
            alert(`${type} QR 코드가 인식되었습니다: ${code.data}`);
          } else {
            alert('QR 코드를 인식할 수 없습니다. 다른 이미지를 시도해주세요.');
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      // 기본 정보 추가
      submitData.append("eventName", formData.eventName);
      submitData.append("department", formData.department);
      submitData.append("surveyStartDate", formData.surveyStartDate.toISOString().slice(0, 10));
      submitData.append("surveyEndDate", formData.surveyEndDate.toISOString().slice(0, 10));
      submitData.append("eventStartDate", formData.eventStartDate.toISOString().slice(0, 10));
      submitData.append("eventEndDate", formData.eventEndDate.toISOString().slice(0, 10));
      submitData.append("maxParticipants", formData.maxParticipants);
      submitData.append("currentParticipants", "0");
      submitData.append("eventDescription", formData.eventDescription);

      // QR 코드 URL 추가
      Object.entries(formData.qrCodeImages).forEach(([type, url]) => {
        if (url) {
          submitData.append(type, url);
        }
      });

      const response = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.code === "SU") {
        alert("행사가 성공적으로 등록되었습니다!");
        navigate("/formlist");
      } else {
        alert("행사 등록에 실패했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("행사 등록 중 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Form onSubmit={handleFormSubmit}>
        <Header>폼 생성</Header>

        <Label>수요 조사 시작일</Label>
        <StyledDatePicker
          selected={formData.surveyStartDate}
          onChange={(date) => handleDateChange(date, "surveyStartDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          required
        />

        <Label>수요 조사 종료일</Label>
        <StyledDatePicker
          selected={formData.surveyEndDate}
          onChange={(date) => handleDateChange(date, "surveyEndDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          required
        />

        <Label>행사 시작일</Label>
        <StyledDatePicker
          selected={formData.eventStartDate}
          onChange={(date) => handleDateChange(date, "eventStartDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일 선택"
          required
        />

        <Label>행사 종료일</Label>
        <StyledDatePicker
          selected={formData.eventEndDate}
          onChange={(date) => handleDateChange(date, "eventEndDate")}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일 선택"
          required
        />

        <Label>최대 수용 인원</Label>
        <Input
          type="number"
          name="maxParticipants"
          placeholder="최대 수용 인원"
          value={formData.maxParticipants}
          onChange={handleInputChange}
          required
        />

        <QrSection>
          <Label>미입금자 토스 QR</Label>
          <QrUploadContainer>
            <QrUploadButton
              type="button"
              onClick={() => fileInputRefs.tossUnpaid.current?.click()}
            >
              QR코드 업로드
            </QrUploadButton>
            <input
              type="file"
              ref={fileInputRefs.tossUnpaid}
              onChange={(e) => handleQrImageUpload("qr_toss_x", e)}
              accept="image/*"
              style={{ display: "none" }}
            />
            {formData.qrCodeImages.qr_toss_x && (
              <QrUrlText>
                인식된 URL: {formData.qrCodeImages.qr_toss_x}
              </QrUrlText>
            )}
          </QrUploadContainer>

          <Label>입금자 토스 QR</Label>
          <QrUploadContainer>
            <QrUploadButton
              type="button"
              onClick={() => fileInputRefs.tossPaid.current?.click()}
            >
              QR코드 업로드
            </QrUploadButton>
            <input
              type="file"
              ref={fileInputRefs.tossPaid}
              onChange={(e) => handleQrImageUpload("qr_toss_o", e)}
              accept="image/*"
              style={{ display: "none" }}
            />
            {formData.qrCodeImages.qr_toss_o && (
              <QrUrlText>
                인식된 URL: {formData.qrCodeImages.qr_toss_o}
              </QrUrlText>
            )}
          </QrUploadContainer>

          <Label>미입금자 카카오페이 QR</Label>
          <QrUploadContainer>
            <QrUploadButton
              type="button"
              onClick={() => fileInputRefs.kakaoUnpaid.current?.click()}
            >
              QR코드 업로드
            </QrUploadButton>
            <input
              type="file"
              ref={fileInputRefs.kakaoUnpaid}
              onChange={(e) => handleQrImageUpload("qr_kakaopay_x", e)}
              accept="image/*"
              style={{ display: "none" }}
            />
            {formData.qrCodeImages.qr_kakaopay_x && (
              <QrUrlText>
                인식된 URL: {formData.qrCodeImages.qr_kakaopay_x}
              </QrUrlText>
            )}
          </QrUploadContainer>

          <Label>입금자 카카오페이 QR</Label>
          <QrUploadContainer>
            <QrUploadButton
              type="button"
              onClick={() => fileInputRefs.kakaoPaid.current?.click()}
            >
              QR코드 업로드
            </QrUploadButton>
            <input
              type="file"
              ref={fileInputRefs.kakaoPaid}
              onChange={(e) => handleQrImageUpload("qr_kakaopay_o", e)}
              accept="image/*"
              style={{ display: "none" }}
            />
            {formData.qrCodeImages.qr_kakaopay_o && (
              <QrUrlText>
                인식된 URL: {formData.qrCodeImages.qr_kakaopay_o}
              </QrUrlText>
            )}
          </QrUploadContainer>
        </QrSection>

        <SubmitButton type="submit">등록하기</SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateForm;

// 스타일 컴포넌트들
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  min-height: 100px;
  resize: vertical;
`;

const DeadlineContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const SmallInput = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const Col = styled.div`
  flex: 1;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const AddQuestionButton = styled.button`
  background: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    background: #0056b3;
  }
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

const QuestionBox = styled.div`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const QuestionTitle = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  ${props => props.type === "송금추가" && "display: none;"}
`;

const QrSection = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QrUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

const QrUploadButton = styled.button`
  background: #007BFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0056b3;
  }
`;

const SubmitButton = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background: #218838;
  }
`;

const QrUrlText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  word-break: break-all;
  text-align: center;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
`;