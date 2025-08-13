// CommonForm.jsx
import React from "react";

export default function CommonForm({ onSubmit, children }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
      {/* 버튼은 자식으로 받아도 되고, 여기서도 넣어도 됨 */}
    </form>
  );
}
