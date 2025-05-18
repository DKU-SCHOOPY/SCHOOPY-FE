import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: {
      year: "2025",
      month: "03",
      day: "10",
      time: "11:59",
    },
    department: "소프트웨어학과",
    gender: "남성",
    yearFrom: "2001",
    yearTo: "2006",
    questions: [],
    qrImages: {}
  });

  const fileInputRef = useRef(null);

  const addQuestion = (type) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type,
      title: type === "송금추가" ? "" : "질문을 입력하세요",
      options: type === "객관식" ? ["", ""] : [],
      qrImage: type === "송금추가" ? null : undefined
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleTitleChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, title: value } : q
      )
    }));
  };

  const handleOptionChange = (qId, idx, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId
          ? {
            ...q,
            options: q.options.map((opt, i) => (i === idx ? value : opt)),
          }
          : q
      )
    }));
  };

  const addOption = (qId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ""] } : q
      )
    }));
  };

  const removeOption = (qId, idx) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    }));
  };

  const deleteQuestion = (qId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== qId)
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(formData.questions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFormData(prev => ({
      ...prev,
      questions: reordered
    }));
  };

  const handleQrImageUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          qrImages: {
            ...prev.qrImages,
            [questionId]: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("제목과 설명을 모두 입력해주세요.");
      return;
    }

    if (formData.questions.length === 0) {
      alert("최소 하나 이상의 질문을 추가해주세요.");
      return;
    }

    try {
      const submitData = new FormData();

      // 기본 정보 추가
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("department", formData.department);
      submitData.append("gender", formData.gender);
      submitData.append("yearFrom", formData.yearFrom);
      submitData.append("yearTo", formData.yearTo);

      // 마감일시 포맷팅
      const deadline = `${formData.deadline.year}-${formData.deadline.month}-${formData.deadline.day} ${formData.deadline.time}`;
      submitData.append("deadline", deadline);

      // 질문 데이터 추가
      const questionsData = formData.questions.map(q => ({
        type: q.type,
        title: q.title,
        options: q.options,
        qrImage: q.type === "송금추가" ? formData.qrImages[q.id] : undefined
      }));
      submitData.append("questions", JSON.stringify(questionsData));

      const response = await axios.post(
        "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/form/create",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data) {
        alert("폼이 성공적으로 생성되었습니다!");
        navigate("/form/AddSchedule");
      }
    } catch (error) {
      alert("폼 생성 실패: " + error.message);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <Form onSubmit={handleSubmit}>
        <Header>폼 생성</Header>

        <Label>폼 제목</Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="제목을 입력하세요"
          required
        />

        <Label>설명</Label>
        <TextArea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="설명을 입력하세요"
          required
        />

        <Label>신청 마감</Label>
        <DeadlineContainer>
          <SmallInput
            type="text"
            value={formData.deadline.year}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                deadline: { ...prev.deadline, year: e.target.value }
              }))
            }
            placeholder="YYYY"
            required
          />
          <SmallInput
            type="text"
            value={formData.deadline.month}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                deadline: { ...prev.deadline, month: e.target.value }
              }))
            }
            placeholder="MM"
            required
          />
          <SmallInput
            type="text"
            value={formData.deadline.day}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                deadline: { ...prev.deadline, day: e.target.value }
              }))
            }
            placeholder="DD"
            required
          />
          <SmallInput
            type="text"
            value={formData.deadline.time}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                deadline: { ...prev.deadline, time: e.target.value }
              }))
            }
            placeholder="HH:MM"
            required
          />
        </DeadlineContainer>

        <Label>신청 학과</Label>
        <Select
          value={formData.department}
          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          required
        >
          <option value="소프트웨어학과">소프트웨어학과</option>
          <option value="컴퓨터공학과">컴퓨터공학과</option>
          <option value="데이터사이언스학과">데이터사이언스학과</option>
          <option value="사이버보안학과">사이버보안학과</option>
        </Select>

        <Label>신청 연령/성별</Label>
        <YearRangeContainer>
          <SmallInput
            type="text"
            value={formData.yearFrom}
            onChange={(e) => setFormData(prev => ({ ...prev, yearFrom: e.target.value }))}
            placeholder="2001"
            required
          />
          <span>년부터</span>
          <SmallInput
            type="text"
            value={formData.yearTo}
            onChange={(e) => setFormData(prev => ({ ...prev, yearTo: e.target.value }))}
            placeholder="2025"
            required
          />
          <span>년생까지</span>
        </YearRangeContainer>

        <GenderContainer>
          <GenderButton
            type="button"
            selected={formData.gender === "남성"}
            onClick={() => setFormData(prev => ({ ...prev, gender: "남성" }))}
          >
            남성
          </GenderButton>
          <GenderButton
            type="button"
            selected={formData.gender === "여성"}
            onClick={() => setFormData(prev => ({ ...prev, gender: "여성" }))}
          >
            여성
          </GenderButton>
        </GenderContainer>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions" isDropDisabled={false}>
            {(provided) => (
              <QuestionList ref={provided.innerRef} {...provided.droppableProps}>
                {formData.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <QuestionBox
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <QuestionTitle type={question.type}>
                          질문 {index + 1}.
                          <Input
                            type="text"
                            placeholder="질문을 입력하세요."
                            value={question.title}
                            onChange={(e) => handleTitleChange(question.id, e.target.value)}
                            required
                          />
                        </QuestionTitle>

                        {question.type === "객관식" && (
                          <>
                            {question.options.map((option, idx) => (
                              <OptionRow key={idx}>
                                <OptionInput
                                  type="text"
                                  placeholder={`선택 ${idx + 1}`}
                                  value={option}
                                  onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                                  required
                                />
                                <DeleteButton onClick={() => removeOption(question.id, idx)}>
                                  삭제
                                </DeleteButton>
                              </OptionRow>
                            ))}
                            <AddOptionButton onClick={() => addOption(question.id)}>
                              선택지 추가
                            </AddOptionButton>
                          </>
                        )}

                        {question.type === "주관식" && (
                          <TextArea
                            placeholder="주관식 답변을 입력하세요"
                            disabled
                            style={{ backgroundColor: "#f5f5f5" }}
                          />
                        )}

                        {question.type === "송금추가" && (
                          <QrUploadContainer>
                            <QrUploadButton
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              QR코드 이미지 업로드
                            </QrUploadButton>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => handleQrImageUpload(question.id, e)}
                              accept="image/*"
                              style={{ display: "none" }}
                              required
                            />
                            {formData.qrImages[question.id] && (
                              <QrPreview
                                src={formData.qrImages[question.id]}
                                alt="QR Code Preview"
                              />
                            )}
                          </QrUploadContainer>
                        )}

                        <DeleteQuestionButton onClick={() => deleteQuestion(question.id)}>
                          질문 삭제
                        </DeleteQuestionButton>
                      </QuestionBox>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </QuestionList>
            )}
          </Droppable>
        </DragDropContext>

        <ButtonContainer>
          <AddQuestionButton type="button" onClick={() => addQuestion("객관식")}>
            객관식 질문 추가
          </AddQuestionButton>
          <AddQuestionButton type="button" onClick={() => addQuestion("주관식")}>
            주관식 질문 추가
          </AddQuestionButton>
          <AddQuestionButton type="button" onClick={() => addQuestion("송금추가")}>
            송금 QR코드 추가
          </AddQuestionButton>
        </ButtonContainer>

        <SubmitButton type="submit">폼 생성하기</SubmitButton>
      </Form>
    </Container>
  );
};

export default CreatePost;

// 스타일
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
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
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

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const YearRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const GenderContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const GenderButton = styled.button`
  background: ${(props) => (props.selected ? "#007BFF" : "none")};
  color: ${(props) => (props.selected ? "white" : "#007BFF")};
  border: 1px solid #007BFF;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
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

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
`;

const AddOptionButton = styled.button`
  background: none;
  border: none;
  color: #007BFF;
  cursor: pointer;
  padding: 5px;
  margin-top: 5px;
`;

const QrUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const QrPreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

const DeleteQuestionButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
  margin-top: 10px;
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