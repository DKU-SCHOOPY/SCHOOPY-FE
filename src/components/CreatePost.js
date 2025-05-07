import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ addNewPost }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // 게시물 저장 함수
  const savePost = () => {
    if (!title.trim() && !description.trim()) {
      alert("제목 또는 설명을 입력하세요.");
      return;
    }
    
  if (image) {
    const reader = new FileReader();
    reader.readAsDataURL(image); // Base64로 변환
    reader.onloadend = () => {
      const newPost = {
        user: "사용자 이름", // 여기에 실제 사용자 정보 추가 가능
        title,
        description,
        image: reader.result, // 변환된 이미지 데이터 저장
      };
      addNewPost(newPost);
      navigate("/"); // 메인 화면으로 이동
    };
  } else {
    const newPost = {
      user: "사용자 이름",
      title,
      description,
      image: null,
    };
    addNewPost(newPost);
    navigate("/");
  }
    const imageUrl = image ? URL.createObjectURL(image) : null;
    
    const newPost = { title, description, image };
    addNewPost(newPost); 
    navigate("/");
  };

  return (
    <Container>
      {/* 게시물 작성 폼 */}
      <Form>
        <p></p>
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

        <Label>사진 첨부 (선택사항)</Label>
        <FileInput type="file" onChange={(e) => setImage(e.target.files[0])} />

        <ButtonContainer>
          {/* 🟢 폼 건너뛰기 버튼 → 게시 후 메인 페이지 이동 */}
          <SkipButton type="button" onClick={savePost}>
            폼 건너뛰기
          </SkipButton>
          
          {/* 🟡 폼 작성 버튼 → /form 페이지로 이동 */}
          <FormButton type="button" onClick={() => navigate("/form")}>
            폼 작성
          </FormButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

// 🎨 스타일
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const TextArea = styled.textarea`
  padding: 10px;
  height: 150px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const FileInput = styled.input`
  margin-top: 5px;
  height: 150px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SkipButton = styled.button`
  background: #ddd;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const FormButton = styled.button`
  background: #6c5ce7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default CreatePost;
