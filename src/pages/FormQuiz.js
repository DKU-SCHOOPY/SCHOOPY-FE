import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type,
      title: "",
      options: type === "객관식" ? ["", ""] : [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleTitleChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, title: value } : q))
    );
  };

  const handleOptionChange = (qId, idx, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (qId) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const removeOption = (qId, idx) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );
  };

  const deleteQuestion = (qId) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(questions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setQuestions(reordered);
  };

  const handleNext = () => {
    console.log(questions);
    navigate("/AddSchedule"); // 다음 페이지 이동
  };

  return (
    <Container>
      <Header>폼 생성</Header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <QuestionList ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <QuestionBox ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <QuestionTitle>
                        질문 {index + 1}.
                        <Input
                          type="text"
                          placeholder="질문을 입력하세요."
                          value={question.title}
                          onChange={(e) => handleTitleChange(question.id, e.target.value)}
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
                              />
                              {question.options.length > 2 && (
                                <RemoveOptionButton onClick={() => removeOption(question.id, idx)}>
                                  ❌
                                </RemoveOptionButton>
                              )}
                            </OptionRow>
                          ))}
                          <AddOptionButton onClick={() => addOption(question.id)}>선택지 추가</AddOptionButton>
                        </>
                      )}

                      <DeleteButton onClick={() => deleteQuestion(question.id)}>질문 삭제</DeleteButton>
                    </QuestionBox>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </QuestionList>
          )}
        </Droppable>
      </DragDropContext>

      {/* 버튼 모음 */}
      <ButtonContainer>
        <SelectButton onClick={() => addQuestion("객관식")}>객관식</SelectButton>
        <SelectButton onClick={() => addQuestion("주관식")}>주관식</SelectButton>
        <SelectButton onClick={() => addQuestion("송금추가")}>송금 추가</SelectButton>
        <SelectButton onClick={() => addQuestion("게시글연결")}>게시글 연결</SelectButton>
      </ButtonContainer>

      <NextButton onClick={handleNext}>다음으로</NextButton>
    </Container>
  );
};

export default CreateQuestion;

// 🎨 스타일
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionBox = styled.div`
  background: #fafafa;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 12px;
`;

const QuestionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const RemoveOptionButton = styled.button`
  background: transparent;
  border: none;
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const AddOptionButton = styled.button`
  margin-top: 10px;
  background: #f1f3f5;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  margin-top: 10px;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

const SelectButton = styled.button`
  flex: 1 1 45%;
  padding: 12px;
  background: #f1f3f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #dfe6e9;
  }
`;

const NextButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #6c5ce7;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  margin-top: 20px;
  cursor: pointer;
`;



//npm install react-beautiful-dnd
//yarn add react-beautiful-dnd