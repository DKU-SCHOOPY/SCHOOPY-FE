import React, { useState } from "react";
import jsQR from "jsqr"; // QR 코드 스캐너 라이브러리
import "./QRupload.css";
import axios from "axios";

const QRupload = () => {
  const [qrData, setQrData] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target.result;
      setQrImage(img.src);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);

        if (code) {
          setQrData(code.data); // QR 코드에서 추출된 URL
          saveQrToDB(code.data); //URL을 백엔드로 전송송
        } else {
          alert("QR 코드를 인식할 수 없습니다.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleTossPayment = () => {
    if (!qrData) {
      alert("QR 코드가 인식되지 않았습니다.");
      return;
    }

    // 토스 송금 URL 실행
    window.open(qrData, "_blank"); // 새 창에서 실행
  };

  const saveQrToDB = async (qrUrl) => {
    try {
      const response = await axios.post("http://localhost:5000/save-qrcode", { qrUrl });
      alert(response.data.message);
    }
    catch (error){
      console.error("QR 코드 저장 실패:", error);
      alert("QR코드 저장 중 오류 발생");
    }
  };

  return (
    <div className="upload-container">
      <label className="preview">
        <input type="file" className="file" onChange={handleFileChange} />
        
        <p className="preview_desc">QR 코드 이미지를 업로드하세요.</p>
      </label>

      {qrImage && <img src={qrImage} alt="QR 코드" className="qr-preview" />}

      {qrData && (
        <button className="toss-button" onClick={handleTossPayment}>
          토스로 송금하기
        </button>
      )}
    </div>
  );
};

export default QRupload;
