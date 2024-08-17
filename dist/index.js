"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const rooms_route_1 = require("./routes/rooms-route");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const PORT = 3000;
const server = http_1.default.createServer(app);
// export const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] },
// });
async function main() {
    // Middleware
    app.use(express_1.default.json());
    // Configure CORS properly for production
    app.use((0, cors_1.default)({
        origin: ["https://getSafty.vercel.app"], //Frontend link
        methods: ["POST", "GET", "UPDATE", "DELETE"],
        credentials: true,
    }));
    // Connect to database
    (0, db_1.connectDB)();
    // app.use(socketMiddleware(io));
    // io.on("connection", (socket: Socket) => {
    //   console.log("connection", socket.id);
    //   socket.on("disconnect", () => {
    //     console.log("disconnect");
    //   });
    // });
    // Routes
    // app.use("/api/auth", authRoutes);
    app.use("/api/room", rooms_route_1.roomsRoutes);
    // app.use("/api/alert", alertRoute);
    // displaied if connected successfuly
    app.get("/", (req, res) => res.json("Express on Vercel"));
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
main();
