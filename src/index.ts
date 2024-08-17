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
const PORT = 3000;

const app = express();
// Configure CORS properly for production
app.use(
  cors({
    origin: ["https://get-safety.vercel.app"], //Frontend link
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
