import Item from "../models/Item.js";

export const biddingHandler = (io, socket) => {
  
  // 1. Sync Time: Send server time on connection to prevent client clock hacks
  socket.on("REQUEST_TIME", () => {
    socket.emit("SERVER_TIME", { serverTime: Date.now() });
  });

  socket.on("BID_PLACED", async ({ itemId, bidAmount, userId }) => {
    const now = new Date();

    // 2. Concurrency: specific query ensures we only update if bid > current
    const updatedItem = await Item.findOneAndUpdate(
      {
        _id: itemId,
        auctionEndTime: { $gt: now }, // Ensure auction active
        currentBid: { $lt: bidAmount } // Ensure race condition handling
      },
      {
        $set: {
          currentBid: bidAmount,
          highestBidder: userId
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      // Check why it failed to give specific feedback
      const item = await Item.findById(itemId);
      if (new Date(item.auctionEndTime) <= now) {
        socket.emit("BID_ERROR", { message: "Auction has ended!" });
      } else {
        socket.emit("BID_ERROR", { message: "You were outbid instantly!" });
        // Send the latest data so their UI updates immediately
        socket.emit("UPDATE_BID", item); 
      }
      return;
    }

    // Broadcast new bid to EVERYONE
    io.emit("UPDATE_BID", updatedItem);
  });
};