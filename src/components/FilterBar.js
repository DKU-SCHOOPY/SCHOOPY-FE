import React, { useRef, useState } from "react";
import "./FilterBar.css";

export default function FilterBar({ filters, selected, onSelect }) {
  const barRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - barRef.current.offsetLeft;
    scrollLeft.current = barRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault(); // prevent text selection
    const x = e.pageX - barRef.current.offsetLeft;
    const walk = x - startX.current;
    barRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="filter-bar drag-scroll"
      ref={barRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {filters.map((f) => (
        <button
          key={f}
          className={`filter-button ${selected === f ? "selected" : ""}`}
          onClick={() => onSelect(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
