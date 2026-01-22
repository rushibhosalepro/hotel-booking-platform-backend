import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import UserRouter from "./routes/user";
import HotelRouter from "./routes/hotels";
import { authMiddleware } from "./routes/middleware";
const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(authMiddleware);
app.use("/", UserRouter);
app.use("/", HotelRouter);

// wss.on("connection", (ws) => {
//   ws.on("message", async (msg: string) => {
//     const message = msg.toString();
//     console.log(message);
//   });
// });
server.listen(3000, () =>
  console.log(`server running at http://localhost:${3000}`),
);
