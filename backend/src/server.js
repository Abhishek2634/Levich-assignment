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

server.listen(4000, () => {
  console.log("Backend running on port 4000");
});
