"use client";
import { useState } from "react";

export default function CreateAuction({ onCreated }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(100);
  const [duration, setDuration] = useState(5); 
  const [loading, setLoading] = useState(false);

  const createAuction = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SOCKET_URL + "/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startingPrice: Number(price),
          durationMinutes: Number(duration)
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      onCreated(data);
      setTitle("");
      setPrice(100);
      setDuration(5);
    } catch (err) {
      console.error("Auction Create Error:", err); 
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-card">
      <h2>🔥 Start a New Auction</h2>
      
      <form onSubmit={createAuction} className="form-row">
        
        <div className="input-group main">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="e.g. Rolex Watch"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Price Group */}
        <div className="input-group small">
          <label>Start Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            min="1"
            required
          />
        </div>

        {/* Duration Group */}
        <div className="input-group small">
          <label>Duration (Min)</label>
          <input
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            min="1"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "..." : "Create Auction"}
        </button>

      </form>
    </div>
  );
}