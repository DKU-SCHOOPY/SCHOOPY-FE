<<<<<<< HEAD
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Files from "./pages/Nav/FormList";
import CalendarPage from "./pages/Nav/CalendarPage";
import Chat from "./pages/Nav/Chat";
import Profile from "./pages/Nav/Profile";
import Notifications from "./pages/Nav/Notifications";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import CreatePost from "./pages/CreatePost";
import CreateForm from "./pages/CreateForm";
import AddSchedule from "./pages/AddSchedule";
import FormQuiz from "./pages/FormQuiz";
import EventApplicants from "./pages/Nav/EventApplicants";
import axios from "axios";
import FormApplicants from "./pages/Nav/FormApplicants";
// 🚩 별도 컴포넌트로 분리 (useLocation 사용은 Router 내부에서만 가능)
async function submitSurvey(data) {
  const res = await axios.post(
    "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/submit-survey",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}
async function remitEvent(data) {
  const res = await axios.post(
    "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/remit-event",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}
async function approveApplication(data) {
  const res = await axios.post(
    "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/approve",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}
async function registEvent(formData) {
  const res = await axios.post(
    "http://ec2-13-125-219-87.ap-northeast-2.compute.amazonaws.com:8080/schoopy/v1/event/regist-event",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res.data;
}
function Layout() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // 헤더/네비를 숨길 경로들
  const hiddenPaths = ["/create-post", "/EventApplicants", "/CreateForm", "/FormQuiz", "/form/schedule","/Nav/FormList","/Nav/EventApplicants/:id","/Nav/FormApplicants"];

  const hideHeaderFooter = hiddenPaths.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/CreateForm" element={<CreateForm addNewPost={addNewPost} />} />
        <Route path="/FormQuiz" element={<FormQuiz />} />
        <Route path="/form/schedule" element={<AddSchedule />} />
        <Route path="/Nav/FormList" element={<Files />} />
        <Route path="/Nav/EventApplicants/:id" element={<EventApplicants />} />
        <Route path="/Nav/FormApplicants" element={<FormApplicants />} />
      </Routes>
      {!hideHeaderFooter && <Navbar />}
    </>
  );
}
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Select from "./pages/Select";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Calendar from "./pages/Calendar";
>>>>>>> 49df151040dea7fdd4ebc17f18a21d0b30bc7ea5

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Layout />
=======
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/select" element={<Select />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
>>>>>>> 49df151040dea7fdd4ebc17f18a21d0b30bc7ea5
    </Router>
  );
}

export default App;
