import express from "express";
import cors from "cors";
import itemsRoute from "./routes/Items.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/items", itemsRoute);

export default app;
