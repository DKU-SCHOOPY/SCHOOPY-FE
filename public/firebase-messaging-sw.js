// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAGML3WGxYeTrvCVs6Llw6h46YeFOnSoRg",
  authDomain: "schoopychat.firebaseapp.com",
  projectId: "schoopychat",
  storageBucket: "schoopychat.firebasestorage.com",
  messagingSenderId: "1049438289800",
  appId: "1:1049438289800:web:b358a13222225dd069843d",
  measurementId: "G-SZW66G9SQE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload?.notification?.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});