import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./CreatePost.css";

export default function FormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [imageFileList, setImageFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentFiles = imageFileList;
    const combinedFiles = [...currentFiles, ...newFiles];

    if (combinedFiles.length > 10) {
      alert("이미지는 최대 10장까지 첨부 가능합니다.");
      const slicedFiles = combinedFiles.slice(0, 10);
      setImageFileList(slicedFiles);
      setImagePreview(slicedFiles.map(file => URL.createObjectURL(file)));
    } else {
      setImageFileList(combinedFiles);
      setImagePreview(combinedFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const handleImageDelete = (index) => {
    const newImageFileList = imageFileList.filter((_, i) => i !== index);
    const newImagePreview = imagePreview.filter((_, i) => i !== index);
    setImageFileList(newImageFileList);
    setImagePreview(newImagePreview);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("게시물 제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("게시물 설명을 입력해주세요.");
      return;
    }

    const eventData = {
      eventName: title,
      eventDescription: description,
      department: department,
      imagePreview,
      imageFile: imageFileList,
    };
    navigate("/createform", { state: eventData });
  };

  const handleSkip = async () => {
    const formData = new FormData();
    formData.append("eventName", title);
    formData.append("eventDescription", description);
    formData.append("department", department);
    imageFileList.forEach(file => {
      formData.append("eventImages", file);
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/event/regist-event`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("등록 성공!");
      navigate("/home");
    } catch (e) {
      alert("등록 실패: " + e.message);
    }
  };

  return (
    <div className="container">
      <Header title="게시물 생성" showBack />
      {/* <button className="back-button" onClick={() => navigate(-1)}>←</button> */}
      {/* <div className="page-title">게시물 생성</div> */}

      <label className="label">게시물 제목</label>
      <input
        type="text"
        className="textarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />

      <label className="label">설명</label>
      <textarea
        className="longtext"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명을 입력하세요"
      />

      <label className="label">학과 선택</label>
      <select
        className="textarea"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="SW융합대학학생회">SW융합대학학생회</option>
        <option value="소프트웨어학과">소프트웨어학과</option>
        <option value="컴퓨터공학과">컴퓨터공학과</option>
        <option value="통계데이터사이언스학과">통계데이터사이언스학과</option>
        <option value="사이버보안학과">사이버보안학과</option>
      </select>

      <label className="label">사진 첨부</label>
      <label htmlFor="imageUpload" className="form-upload-button">
        갤러리에서 가져오기
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {imagePreview.length > 0 && (
        <div className="form-image-preview">
          {imagePreview.map((src, idx) => (
            <div key={idx} style={{ position: "relative", marginTop: "10px" }}>
              <img
                src={src}
                alt={`미리보기 ${idx + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
              <button
                onClick={() => handleImageDelete(idx)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#ff4444",
                  color: "#fff",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="form-button-group">
        <button className="form-skip-button" onClick={handleSkip}>폼 건너뛰기</button>
        <button className="form-submit-button" onClick={handleSubmit}>폼 생성</button>
      </div>
    </div>
  );
}
