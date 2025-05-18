import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function FormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  const handleSkip = async () => {
    // 입력 데이터 준비
    const formData = new FormData();
    formData.append("eventName", title);
    formData.append("eventDescription", description);
    if (image) formData.append("eventImages", image);
    // ...필요한 필드 추가
  
    try {
      await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/");
    } catch (e) {
      alert("등록 실패: " + e.message);
    }
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("eventName", title);
    formData.append("eventDescription", description);
    formData.append("eventImages", image);
    // 여기에 게시물 생성 로직 추가
    console.log({
      title,
      description,
      image,
    });
    navigate("/createform");
    try {
      const res = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("등록 성공!");
      navigate("/home"); // Home.js로 이동
    } catch (e) {
      alert("등록 실패: " + e.message);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Title>게시물 생성</Title>

      <Label>게시물 제목</Label>
      <Input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="제목을 입력하세요" 
      />

      <Label>설명</Label>
      <TextArea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="설명을 입력하세요" 
      />

      <Label>사진 첨부</Label>
      <UploadButton as="label" htmlFor="imageUpload">
        갤러리에서 가져오기
      </UploadButton>
      <input 
        id="imageUpload" 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={handleImageUpload}
      />
      
      {image && <ImagePreview src={image} alt="업로드한 이미지 미리보기" />}

      <ButtonGroup>
        <SkipButton onClick={() => navigate("/home")}>폼 건너뛰기</SkipButton>
        <SubmitButton onClick={handleSubmit}>폼 생성</SubmitButton>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
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

const Title = styled.h1`
  margin-top: 60px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const Label = styled.label`
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
`;

const Input = styled.input`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  height: 120px;
  font-size: 16px;
`;

const UploadButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  margin-top: 15px;
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 30px;
`;

const SkipButton = styled.button`
  flex: 1;
  margin-right: 10px;
  padding: 15px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  flex: 1;
  margin-left: 10px;
  padding: 15px;
  background-color: #7b61ff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;