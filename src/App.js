import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import ProtectedRoute from "./routes/ProtectedRoute";

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
import Excel from "./pages/Exceldown";
import Answer from "./pages/Answer";

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

  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  <Route path="/formlist" element={<ProtectedRoute><FormList /></ProtectedRoute>} />
  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
  <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
  <Route path="/chat/room/:roomId" element={<ProtectedRoute><Chatting /></ProtectedRoute>} />
  <Route path="/mypage" element={<ProtectedRoute><Mypage /></ProtectedRoute>} />
  <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
  <Route path="/alarm" element={<ProtectedRoute><Alarm /></ProtectedRoute>} />
  <Route path="/createform" element={<ProtectedRoute><CreateForm /></ProtectedRoute>} />
  <Route path="/addschedule" element={<ProtectedRoute><AddSchedule /></ProtectedRoute>} />
  <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
  <Route path="/oauth2/authorization/kakao" element={<ProtectedRoute><KakaoCallback /></ProtectedRoute>} />
  <Route path="/oauth2/callback/naver" element={<ProtectedRoute><NaverCallback /></ProtectedRoute>} />
  <Route path="/oauth2/authorization/kakao/link" element={<ProtectedRoute><KakaoLinkCallback /></ProtectedRoute>} />
  <Route path="/oauth2/authorization/naver/link" element={<ProtectedRoute><NaverLinkCallback /></ProtectedRoute>} />
  <Route path="/eventdetail/:eventCode" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
  <Route path="/formquest/:eventCode" element={<ProtectedRoute><Form /></ProtectedRoute>} />
  <Route path="/excel/:eventCode" element={<ProtectedRoute><Excel /></ProtectedRoute>} />
  <Route path="/answer/:applicationId" element={<ProtectedRoute><Answer /></ProtectedRoute>} />

  <Route
    path="/form/:eventCode"
    element={<ProtectedRoute><RoleBasedRoute student={FormPage} council={Event} /></ProtectedRoute>}
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
