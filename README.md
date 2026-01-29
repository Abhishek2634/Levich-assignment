# Levich Assignment
## 🟢 Live Bidding Platform

A real-time auction application where users compete to buy items in the final seconds. Built to handle high concurrency and provide instant visual feedback.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Node.js](https://img.shields.io/badge/Node.js-18-green) ![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-white) ![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## Live Links
- **Frontend**: https://levich-assignment.vercel.app/
- **Backend**: https://levich-assignment-cbhx.onrender.com/

## ✨ Features

- **Real-Time Bidding:** Instant bid updates across all clients using Socket.io.
- **Race Condition Handling:** Robust backend logic prevents double-booking or invalid bids during high concurrency.
- **Synced Timer:** Countdown is calculated based on server time, preventing client-side manipulation.
- **Visual Feedback:** 
  - 🟢 Green flash animation on new bids.
  - 🏆 "You Lead" / "You Won" badges.
  - 🔴 "Outbid" alerts.
- **Dockerized:** Full stack (frontend + backend + database) spins up with one command.

---

## 🚀 How to run

### Option 1 — Docker (Recommended)
The easiest way to run the application. Ensure you have Docker and Docker Compose installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhishek2634/Levich-assignment.git
   cd Levich-assignment
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Open your browser:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
---

### Option 2 — Manual Setup (Localhost)

1. Backend
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # MONGO_URI=....
   npm start
   ```
   - Backend runs on port 4000 by default.

2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Frontend runs on port 3000 by default.

---

## 🧩 Environment variables

- MONGO_URI — MongoDB connection string (example: `mongodb://localhost:27017/auctionDB`)
- Any other environment variables required by the backend/frontend should be added to their respective `.env` files (check the project folders for `.env.example` if present).

---

## 🛠️ Notes & Tips

- The countdown timer is server-driven; do not rely on client clock for auction end logic.
- For local development of real-time features, make sure both frontend & backend are running and able to reach each other (CORS and socket endpoints configured correctly).
- To test concurrency and race-condition handling, use multiple browser windows/devices and place bids simultaneously near the auction end.

---

**Made with dedication by Abhishek !**
