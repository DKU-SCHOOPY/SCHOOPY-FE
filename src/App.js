import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from 'react';
import './App.css';

import Welcome from "./pages/Welcome";
import Select from "./pages/Select";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import FormList from "./pages/FormList"
import Event from "./pages/Event"
import Form from "./pages/Form"
import Chat from "./pages/Chat";
import Chatting from "./pages/Chatting";
import Mypage from "./pages/Mypage";
import Edit from './pages/Edit';
import Navbar from "./components/Navbar";
import Alarm from "./pages/Alarm";

import CreatePost from "./pages/CreatePost";
import CreateForm from "./pages/CreateForm";
import AddSchedule from "./pages/AddSchedule";

import KakaoCallback from "./pages/KakaoCallback";
import NaverCallback from "./pages/NaverCallback";
import KakaoLinkCallback from "./pages/KakaoLinkCallback";
import NaverLinkCallback from "./pages/NaverLinkCallback";

import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';
import axios from 'axios';


function Layout() {
  const location = useLocation();

  // 헤더/네비를 숨길 경로들
  const hidePaths = [
    /^\/$/,             // /
    /^\/select$/,       // /select
    /^\/login$/,        // /login
    /^\/join$/,         // /join
    /^\/chat\/room\/[^/]+$/,   // /chat/room/:id
    /^\/createpost$/, // /createpost 경로 추가More actions
    /^\/createform$/ // /createform 경로 추가
  ];

  const shouldHideUI = hidePaths.some((pattern) => pattern.test(location.pathname));

  return (
    <div style={{ paddingBottom: shouldHideUI ? 0 : "60px" }}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/select" element={<Select />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/home" element={<Home />} />
        <Route path="/formlist" element={<FormList />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/form/:eventCode" element={<Form />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/room/:roomId" element={<Chatting />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/createform" element={<CreateForm />} />
        <Route path="/addschedule" element={<AddSchedule />} />
        <Route path="/createpost" element={<CreatePost />} /> 
        <Route path="/oauth2/authorization/kakao" element={<KakaoCallback />} />
        <Route path="/oauth2/authorization/naver" element={<NaverCallback />} />
        <Route path="/oauth2/authorization/kakao/link" element={<KakaoLinkCallback />} />
        <Route path="/oauth2/authorization/naver/link" element={<NaverLinkCallback />} />

      </Routes>

      {!shouldHideUI && <Navbar />}
    </div>
  );
}

/*// 채팅 토큰 전송
const getFcmTokenAndSend = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BOH9bBGRA-yCpr7fjseZf9N64ogu79dwcrIyXNVn0QpWZDCuryXZ6Cbv2eTV62cXV7CsmbWdElNXAQ1P0W6CdOE',
    });

    if (token) {
      console.log('FCM Token:', token);

      // 서버로 토큰 전송
      await axios.post('/api/user/fcm-token', {
        token: token,
      });
    } else {
      console.warn('토큰 없음. 권한 요청 필요');
    }
  } catch (err) {
    console.error('토큰 요청 실패', err);
  }
};
*/
// 예: 컴포넌트 마운트 시 실행

export default function App() {
  /*
  useEffect(() => {
    getFcmTokenAndSend();
  }, []);
  */
  return (
    <Router>
      <Layout />
    </Router>
  );
}
