let socket = null;

export const connectSocket = (myId, targetId) => {
  if (socket) return socket;

  socket = new WebSocket(`ws://ec2-3-39-189-60.ap-northeast-2.compute.amazonaws.com:8080/ws/chat/${myId}/${targetId}`);

  socket.onopen = () => {
    console.log("웹소켓 연결됨");
  };

  socket.onclose = () => {
    console.log("웹소켓 연결 끊김");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("웹소켓 오류", err);
  };

  return socket;
};

export const socketFactory = (url) => {
  return () => new WebSocket(url); // 꼭 함수 리턴
};


export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
