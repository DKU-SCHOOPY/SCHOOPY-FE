import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

export default function EventApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("Fetching event data for ID:", id);
        // 행사 정보 조회
        const eventResponse = await axios.get(
          `http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/${id}`
        );

        console.log("Event Response:", eventResponse.data);
        if (eventResponse.data.statusCode === "OK") {
          setEventData(eventResponse.data.data);
        }

        console.log("Fetching applications for event ID:", id);
        // 신청자 목록 조회
        const applicationsResponse = await axios.get(
          `http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/applications/${id}`
        );

        console.log("Applications Response:", applicationsResponse.data);
        if (applicationsResponse.data.statusCode === "OK") {
          const mappedParticipants = applicationsResponse.data.data.map(app => ({
            id: app.applicationId,
            name: app.studentNum.name,
            major: app.studentNum.department,
            status: app.isPaymentCompleted ? "입금완료" : "대기중",
            isStudent: app.isStudent,
            councilFeePaid: app.councilFeePaid
          }));
          console.log("Mapped Participants:", mappedParticipants);
          setParticipants(mappedParticipants);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          console.error("Error Response Status:", error.response.status);
          alert(`데이터를 불러오는데 실패했습니다: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
          console.error("Error Request:", error.request);
          alert("서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.");
        } else {
          console.error("Error Message:", error.message);
          alert("요청 처리 중 오류가 발생했습니다: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    } else {
      console.error("No event ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleApprove = async (applicationId, isAccept) => {
    try {
      console.log("Sending approve request:", {
        applicationId: Number(applicationId),
        choice: isAccept ? "True" : "False"
      });

      const response = await axios.post(
        "http://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/approve",
        {
          applicationId: Number(applicationId),
          choice: isAccept ? "True" : "False"
        }
      );

      console.log("Approve response:", response.data);

      if (response.data.updatedStatus) {
        if (isAccept) {
          alert("신청이 승인되었습니다!");
          setParticipants(prev => prev.map(p =>
            p.id === applicationId ? { ...p, status: "승인됨" } : p
          ));
        } else {
          alert("신청이 반려되었습니다.");
          setParticipants(prev => prev.filter(p => p.id !== applicationId));
        }
      } else {
        console.error("Update status failed:", response.data);
        alert("처리에 실패했습니다.");
      }
    } catch (e) {
      console.error("API Error:", e);
      console.error("Error Response:", e.response?.data);
      console.error("Error Status:", e.response?.status);
      alert("처리 중 오류가 발생했습니다: " + (e.response?.data?.message || e.message));
    }
  };

  if (loading) return <Container>로딩 중...</Container>;
  if (!eventData) return <Container>행사 정보를 찾을 수 없습니다.</Container>;

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={() => navigate(-1)}>&larr;</BackBtn>
        <EventTitle>{eventData.eventName}</EventTitle>
        <RightSpace />
      </TopBar>
      <UserList>
        {participants.length === 0 ? (
          <NoApplicantsMessage>신청자가 없습니다.</NoApplicantsMessage>
        ) : (
          participants.map(user => (
            <UserRow key={user.id}>
              <UserInfo>
                <UserName>{user.major} {user.name}</UserName>
                {/* <UserStatus>
                  {user.isStudent ? "재학생" : "휴학생"} |
                  {user.councilFeePaid ? " 학생회비 납부" : " 학생회비 미납"} |
                  {user.status}
                </UserStatus> */}
              </UserInfo>
              <ActionButtons>
                <AcceptBtn onClick={() => handleApprove(user.id, true)}>수락</AcceptBtn>
                <RejectBtn onClick={() => handleApprove(user.id, false)}>거절</RejectBtn>
              </ActionButtons>
            </UserRow>
          ))
        )}
      </UserList>
    </Container>
  );
}

// 스타일
const Container = styled.div`
  padding: 0 0 80px 0;
  background: #fff;
  min-height: 100vh;
  position: relative;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px 18px 20px;
`;
const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  width: 32px;
`;
const EventTitle = styled.h2`
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
const UserList = styled.div`
  margin: 0 16px;
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 0 12px 0;
  border-bottom: 1px solid #f2f2f2;
`;
const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #222;
`;
const UserStatus = styled.div`
  font-size: 13px;
  color: #7c7c7c;
  margin-top: 2px;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;
const AcceptBtn = styled.button`
  background: #7ed957;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
const RejectBtn = styled.button`
  background: #ffd36e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
const NoApplicantsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 16px;
`;