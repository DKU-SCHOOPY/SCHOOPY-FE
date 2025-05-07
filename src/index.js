<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // App.js 올바르게 가져오는지 확인

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
>>>>>>> 49df151040dea7fdd4ebc17f18a21d0b30bc7ea5
