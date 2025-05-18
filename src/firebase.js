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

// 토큰 요청 함수
export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BOH9bBGRA-yCpr7fjseZf9N64ogu79dwcrIyXNVn0QpWZDCuryXZ6Cbv2eTV62cXV7CsmbWdElNXAQ1P0W6CdOE",
    });
    return token;
  } catch (err) {
    console.error("FCM 토큰 요청 실패", err);
    return null;
  }
};

export { messaging };

/*
const token = await getToken(messaging, {
  vapidKey: process.env.BOH9bBGRA-yCpr7fjseZf9N64ogu79dwcrIyXNVn0QpWZDCuryXZ6Cbv2eTV62cXV7CsmbWdElNXAQ1P0W6CdOE,
});

requestPermission();


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


*/

