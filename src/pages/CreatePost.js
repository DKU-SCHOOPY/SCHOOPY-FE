import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function FormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [imageFileList, setImageFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentFiles = imageFileList;
    const combinedFiles = [...currentFiles, ...newFiles];

    if (combinedFiles.length > 10) {
      alert("이미지는 최대 10장까지 첨부 가능합니다.");
      const slicedFiles = combinedFiles.slice(0, 10);
      setImageFileList(slicedFiles);
      setImagePreview(slicedFiles.map(file => URL.createObjectURL(file)));
    } else {
      setImageFileList(combinedFiles);
      setImagePreview(combinedFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const handleImageDelete = (index) => {
    const newImageFileList = imageFileList.filter((_, i) => i !== index);
    const newImagePreview = imagePreview.filter((_, i) => i !== index);
    setImageFileList(newImageFileList);
    setImagePreview(newImagePreview);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("게시물 제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("게시물 설명을 입력해주세요.");
      return;
    }

    const eventData = {
      eventName: title,
      eventDescription: description,
      department: department,
      imagePreview,
      imageFile: imageFileList,
    };
    navigate("/createform", { state: eventData });
  };

  const handleSkip = async () => {
    const formData = new FormData();
    formData.append("eventName", title);
    formData.append("eventDescription", description);
    formData.append("department", department);
    imageFileList.forEach(file => {
      formData.append("eventImages", file);
    });

    try {
      const res = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("등록 성공!");
      navigate("/home");
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

      <Label>학과 선택</Label>
      <Select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="SW융합대학학생회">SW융합대학학생회</option>
        <option value="소프트웨어학과">소프트웨어학과</option>
        <option value="컴퓨터공학과">컴퓨터공학과</option>
        <option value="통계데이터사이언스학과">통계데이터사이언스학과</option>
        <option value="사이버보안학과">사이버보안학과</option>
      </Select>

      <Label>사진 첨부</Label>
      <UploadButton as="label" htmlFor="imageUpload">
        갤러리에서 가져오기
      </UploadButton>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {imagePreview.length > 0 && (
        <ImagePreviewContainer>
          {imagePreview.map((src, idx) => (
            <ImageWrapper key={idx}>
              <ImagePreview src={src} alt={`미리보기 ${idx + 1}`} />
              <DeleteButton onClick={() => handleImageDelete(idx)}>×</DeleteButton>
            </ImageWrapper>
          ))}
        </ImagePreviewContainer>
      )}

      <ButtonGroup>
        <SkipButton onClick={handleSkip}>폼 건너뛰기</SkipButton>
        <SubmitButton onClick={handleSubmit}>폼 생성</SubmitButton>
      </ButtonGroup>
    </Container>
  );
}

// 💅 스타일 컴포넌트
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
  min-height: 150px;
  height: auto;
  font-size: 16px;
  resize: vertical;
`;

const Select = styled.select`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 100%;
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

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 15px;
  padding-bottom: 15px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff4444;
  color: white;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #ff0000;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
