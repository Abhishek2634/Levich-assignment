"use client";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function ItemCard({ item, userId, serverOffset }) {
  const [current, setCurrent] = useState(item);
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasBid, setHasBid] = useState(false);

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
        setTimeLeft(`${m}m ${s < 10 ? '0' : ''}${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [current, serverOffset]);

  useEffect(() => {
    const handleUpdate = (updated) => {
      if (updated._id === item._id) {
        setIsFlashing(true);
        setCurrent(updated);
        setTimeout(() => setIsFlashing(false), 500); 
      }
    };

    const handleError = (data) => {
      if (hasBid && current.highestBidder !== userId) {
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

          {isWinning && (
            <span className={`badge ${isAuctionEnded ? "winner" : "win"}`}>
              {isAuctionEnded ? "You Won! 🏆" : "You Lead"}
            </span>
          )}

          {isOutbid && <span className="badge out">Outbid</span>}
          

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