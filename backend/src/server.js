import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { biddingHandler } from "./socket/bidding.js";

dotenv.config();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  biddingHandler(io, socket);
});

const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
