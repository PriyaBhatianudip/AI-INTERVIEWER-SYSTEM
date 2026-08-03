 import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (username, onStatusUpdate) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    stompClient.subscribe("/topic/status", (message) => {
      onStatusUpdate(JSON.parse(message.body));
    });

    stompClient.send("/app/online", {}, username);
  });
};

export const disconnectSocket = (username) => {
  if (stompClient) {
    stompClient.send("/app/offline", {}, username);
    stompClient.disconnect();
  }
};
