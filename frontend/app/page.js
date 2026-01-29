"use client";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import ItemCard from "../components/ItemCard";
import CreateAuction from "../components/CreateAuction";

export default function Home() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [serverOffset, setServerOffset] = useState(0);

  useEffect(() => {
    // 1. Load Items
    fetch("http://localhost:4000/items")
      .then(res => res.json())
      .then(setItems);

    // 2. Persist User ID (So refreshing doesn't lose "Winning" status)
    let storedId = localStorage.getItem("auction_user_id");
    if (!storedId) {
      storedId = Math.random().toString(36).slice(2);
      localStorage.setItem("auction_user_id", storedId);
    }
    setUserId(storedId);

    // 3. Sync Time (Global Optimization)
    socket.emit("REQUEST_TIME");
    socket.on("SERVER_TIME", ({ serverTime }) => {
      setServerOffset(serverTime - Date.now()); // Calculate difference
    });

    // 4. Global Socket Listeners for new items
    return () => {
      socket.off("SERVER_TIME");
    };
  }, []);

  if (!userId) return null;

  return (
    <div className="page">
      <h1>Live Auctions</h1>
      <p className="subtitle">
        Create auctions and bid in real-time. Highest bid wins.
      </p>

      <CreateAuction onCreated={item => setItems(prev => [item, ...prev])} />

      {items.length === 0 ? (
        <div className="empty">
          <h2>No active auctions</h2>
          <p>Create one to get started 🚀</p>
        </div>
      ) : (
        <div className="grid">
          {items.map(item => (
            <ItemCard 
              key={item._id} 
              item={item} 
              userId={userId} 
              serverOffset={serverOffset} 
            />
          ))}
        </div>
      )}
    </div>
  );
}