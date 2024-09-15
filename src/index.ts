import express, { Request, Response } from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-route";
import { roomsRoutes } from "./routes/rooms-route";
import { Server, Socket } from "socket.io";
import http from "http";
import socketMiddleware from "./middleware/redAlert-middleware";
import { poll } from "./controllers/red-alert-controller";
import { alertRoute } from "./routes/red-alert-route";
import path from "path";
const PORT = 3000;

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_ORIGIN
      : process.env.PROD_ORIGIN,
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// const server = http.createServer(app);

// S O C K E T S

// export const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] },
// });
// app.use(socketMiddleware(io));
// io.on("connection", (socket: Socket) => {
//   console.log("connection", socket.id);
//   socket.on("disconnect", () => {
//     console.log("disconnect");
//   });
// });

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/room", roomsRoutes);
app.use("/api/alert", alertRoute);

// displayed if connected successfuly
app.get("/", (req, res) => res.json("Express on Vercel"));

// Only listen on a port when running locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
