"use client";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function ItemCard({ item, userId, serverOffset }) {
  const [current, setCurrent] = useState(item);
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasBid, setHasBid] = useState(false);

  // 1. Timer Logic (Synced with Server Offset)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now() + serverOffset;
      const end = new Date(current.auctionEndTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(timer);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        // Pad with zero (e.g., 05s)
        setTimeLeft(`${m}m ${s < 10 ? '0' : ''}${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [current, serverOffset]);

  // 2. Socket Listeners (Bid Updates)
  useEffect(() => {
    const handleUpdate = (updated) => {
      if (updated._id === item._id) {
        setIsFlashing(true);
        setCurrent(updated);
        setTimeout(() => setIsFlashing(false), 500); // Remove flash class
      }
    };

    const handleError = (data) => {
      // Only alert if I am the one who tried to bid
      if (hasBid && current.highestBidder !== userId) {
        // Optional: toast notification here
      }
    };

    socket.on("UPDATE_BID", handleUpdate);
    socket.on("BID_ERROR", handleError);

    return () => {
      socket.off("UPDATE_BID", handleUpdate);
      socket.off("BID_ERROR", handleError);
    };
  }, [item._id, hasBid, current.highestBidder, userId]);

  const placeBid = () => {
    setHasBid(true);
    socket.emit("BID_PLACED", {
      itemId: item._id,
      bidAmount: current.currentBid + 10,
      userId
    });
  };


  const isAuctionEnded = timeLeft === "Ended";
  const isWinning = current.highestBidder === userId;
  const isOutbid = hasBid && !isWinning && !isAuctionEnded;

  return (
    <div className={`card ${isFlashing ? "flash-green" : ""}`}>
      <div>
        <h3>{current.title}</h3>

        <div className="price-container">
          <span className="price">${current.currentBid}</span>

          {/* LOGIC CHANGE HERE: Check if ended to show WIN vs LEAD */}
          {isWinning && (
            <span className={`badge ${isAuctionEnded ? "winner" : "win"}`}>
              {isAuctionEnded ? "You Won! 🏆" : "You Lead"}
            </span>
          )}

          {isOutbid && <span className="badge out">Outbid</span>}
          
          {/* Optional: Hide 'Closed' if we already show 'You Won' to reduce clutter, 
              OR keep it. Here I keep it but maybe you want to hide it if won. */}
          {isAuctionEnded && !isWinning && <span className="badge ended">Closed</span>}
        </div>
      </div>

      <div className="card-footer">
        <div className="timer">
          {isAuctionEnded ? "🏁 Ended" : `⏱ ${timeLeft}`}
        </div>
        
        <button 
          onClick={placeBid} 
          disabled={isAuctionEnded}
        >
          {isAuctionEnded ? "Sold" : "Bid +$10"}
        </button>
      </div>
    </div>
  );
}