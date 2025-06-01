import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // App.js 올바르게 가져오는지 확인

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('서비스 워커 등록 성공:', registration);
    })
    .catch((err) => {
      console.error('서비스 워커 등록 실패:', err);
    });
}
