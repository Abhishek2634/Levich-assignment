import Item from "../models/Item.js";

export const biddingHandler = (io, socket) => {
  
  socket.on("REQUEST_TIME", () => {
    socket.emit("SERVER_TIME", { serverTime: Date.now() });
  });

  socket.on("BID_PLACED", async ({ itemId, bidAmount, userId }) => {
    const now = new Date();

    const updatedItem = await Item.findOneAndUpdate(
      {
        _id: itemId,
        auctionEndTime: { $gt: now }, 
        currentBid: { $lt: bidAmount } 
      },
      {
        $set: {
          currentBid: bidAmount,
          highestBidder: userId
        }
      },
      { new: true } 
    );

    if (!updatedItem) {
      const item = await Item.findById(itemId);
      if (new Date(item.auctionEndTime) <= now) {
        socket.emit("BID_ERROR", { message: "Auction has ended!" });
      } else {
        socket.emit("BID_ERROR", { message: "You were outbid instantly!" });
        socket.emit("UPDATE_BID", item); 
      }
      return;
    }

    io.emit("UPDATE_BID", updatedItem);
  });
};