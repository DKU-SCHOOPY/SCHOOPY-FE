let socket = null;

export function connectSocket(myId, targetId) {
  const token = localStorage.getItem("token");
  socket = new WebSocket(
    `wss://api.schoopy.co.kr/ws/chat/${myId}/${targetId}?token=${token}`
  );

  socket.onopen = () => console.log("웹소켓 연결됨");
  socket.onclose = () => {
    console.log("웹소켓 연결 끊김");
    socket = null;
  };
  socket.onerror = (err) => console.error("웹소켓 오류", err);

  return socket;
}

export const socketFactory = (url) => () => new WebSocket(url);

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
