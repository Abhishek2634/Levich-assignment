import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

/* GET all items */
router.get("/", async (req, res) => {
  const items = await Item.find().sort({ auctionEndTime: 1 });
  res.json(items);
});

/* CREATE auction */
router.post("/", async (req, res) => {
  const { title, startingPrice, durationMinutes } = req.body;

  const item = await Item.create({
    title,
    startingPrice,
    currentBid: startingPrice,
    highestBidder: "",
    auctionEndTime: new Date(Date.now() + durationMinutes * 60000)
  });

  res.status(201).json(item);
});

export default router;
