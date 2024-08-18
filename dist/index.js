"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_route_1 = require("./routes/auth-route");
const rooms_route_1 = require("./routes/rooms-route");
const red_alert_route_1 = require("./routes/red-alert-route");
const path_1 = __importDefault(require("path"));
const PORT = 3000;
const app = (0, express_1.default)();
// Configure CORS properly for production
app.use((0, cors_1.default)({
    origin: ["https://get-safety.vercel.app"], //Frontend link
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    credentials: true,
}));
// Middleware
app.use(express_1.default.json());
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
(0, db_1.connectDB)();
// Routes
app.use("/api/auth", auth_route_1.authRoutes);
app.use("/api/room", rooms_route_1.roomsRoutes);
app.use("/api/alert", red_alert_route_1.alertRoute);
// displayed if connected successfuly
app.get("/", (req, res) => res.json("Express on Vercel"));
// Catch-all route
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
