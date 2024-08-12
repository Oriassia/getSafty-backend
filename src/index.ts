import express, { Request, Response, Express } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-route";
import { roomsRoutes } from "./routes/rooms-route";
import { Server, Socket } from "socket.io";
import http from "http";
import socketMiddleware from "./middleware/redAlert-middleware";
import { poll } from "./controllers/red-alert-controller";
const app: Express = express();
const PORT = 3000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*", methods: ["GER", "POST", "PATCH"] },
});
async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(cors()); // Configure CORS properly for production
  app.use(socketMiddleware(io));
  io.on("connection", (socket: Socket) => {
    console.log("connection", socket.id);
    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  });
  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/room", poll, roomsRoutes);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
