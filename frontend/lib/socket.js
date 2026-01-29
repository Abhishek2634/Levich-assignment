import { io } from "socket.io-client";

// Allow environment variable to override, default to localhost
const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const socket = io(URL, {
  transports: ["websocket"], // Force websocket for better performance
});