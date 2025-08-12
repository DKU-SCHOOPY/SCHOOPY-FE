import React from "react";
import "./Header.css";

function Header({ title, showBack = true, onBack }) {
  return (
    <div className="page-header">
      {showBack && (
        <button className="back-button" onClick={onBack || (() => window.history.back())}>←</button>
      )}
      <h2 className="header-title">{title}</h2>
    </div>
  );
}

export default Header;
