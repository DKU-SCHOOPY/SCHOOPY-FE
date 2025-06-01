// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAGML3WGxYeTrvCVs6Llw6h46YeFOnSoRg",
  authDomain: "schoopychat.firebaseapp.com",
  projectId: "schoopychat",
  storageBucket: "schoopychat.firebasestorage.app",
  messagingSenderId: "1049438289800",
  appId: "1:1049438289800:web:b358a13222225dd069843d",
  measurementId: "G-SZW66G9SQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error("알림 권한 거부됨");
    }
  } catch (err) {
    console.error("알림 권한 요청 실패", err);
  }
};

// 토큰 요청 함수
export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    });
    return token;
  } catch (err) {
    console.error("FCM 토큰 요청 실패", err);
    return null;
  }
};

export { messaging };


