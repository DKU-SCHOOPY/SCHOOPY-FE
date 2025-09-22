import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';

import Welcome from "./pages/Welcome";
import Select from "./pages/Select";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import FormList from "./pages/FormList";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import Chatting from "./pages/Chatting";
import Mypage from "./pages/Mypage";
import Edit from './pages/Edit';
import Alarm from "./pages/Alarm";
import CreatePost from "./pages/CreatePost";
import CreateForm from "./pages/CreateForm";
import AddSchedule from "./pages/AddSchedule";

import KakaoCallback from "./pages/KakaoCallback";
import NaverCallback from "./pages/NaverCallback";
import KakaoLinkCallback from "./pages/KakaoLinkCallback";
import NaverLinkCallback from "./pages/NaverLinkCallback";
import Event from "./pages/Event";
import FormPage from "./pages/Form"; //
import Form from "./pages/Form";

import RoleBasedRoute from "./routes/RoleBasedRoute";
import RoleBasedNavbar from "./components/RoleBasedNavbar";


function Layout() {
  const location = useLocation();

  // 헤더/네비 숨길 경로
  const hidePaths = [
    /^\/$/,             // /
    /^\/select$/,       // /select
    /^\/login$/,        // /login
    /^\/join$/,         // /join
    /^\/chat\/room\/[^/]+$/, // /chat/room/:id
    /^\/createpost$/,   // /createpost
    /^\/createform$/    // /createform
  ];

  const shouldHideUI = hidePaths.some((pattern) => pattern.test(location.pathname));

  return (
    <div style={{ paddingBottom: shouldHideUI ? 0 : "60px" }}>
      {/* 역할 기반 Navbar */}
      {!shouldHideUI && <RoleBasedNavbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/select" element={<Select />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/home" element={<Home />} />
        <Route path="/formlist" element={<FormList />} />
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
        <Route path="/oauth2/callback/naver" element={<NaverCallback />} />
        <Route path="/oauth2/authorization/kakao/link" element={<KakaoLinkCallback />} />
        <Route path="/oauth2/authorization/naver/link" element={<NaverLinkCallback />} />
        <Route path="/eventdetail/:eventCode" element={<EventDetail />} />
        <Route path="/formquest/:eventCode" element={<Form />} />
        
        {/* 역할 기반 라우트 */}
        <Route
          path="/form/:eventCode"
          element={<RoleBasedRoute student={FormPage} council={Event} />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  /*
  useEffect(() => {
    getFcmTokenAndSend(); // FCM 토큰 전송 (주석 유지)
  }, []);
  */

  return (
    <Router>
      <Layout />
    </Router>
  );
}
