import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  startingPrice: Number,
  currentBid: Number,
  highestBidder: String,
  auctionEndTime: Date
});

export default mongoose.model("Item", itemSchema);

