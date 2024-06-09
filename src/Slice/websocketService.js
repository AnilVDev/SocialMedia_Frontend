

// import io from "socket.io-client";

// const SERVER_URL = "ws://127.0.0.1:8000/ws/"; 

// class WebSocketService {
//   constructor(username) {
//     this.socket = io(`${SERVER_URL}${username}/`);
//     this.socket.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });
//     this.socket.on("connect_error", (error) => {
//         console.error("WebSocket connection error:", error);
//       });
//   }

//   sendMessage(message) {
//     console.log('message in service',message)
//     this.socket.emit("chat_message", message);
//   }

//   onMessageReceived(callback) {
//     this.socket.on("chat_message", (data) => {
//       callback(data);
//     });
//   }

//   disconnect() {
//     this.socket.disconnect();
//   }
// }

// export default WebSocketService;
