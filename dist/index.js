"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_route_1 = require("./routes/auth-route");
const rooms_route_1 = require("./routes/rooms-route");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const redAlert_middleware_1 = __importDefault(require("./middleware/redAlert-middleware"));
const red_alert_route_1 = require("./routes/red-alert-route");
const app = (0, express_1.default)();
const PORT = 3000;
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] },
});
async function main() {
    // Connect to database
    await (0, db_1.connectDB)();
    // Middleware
    app.use(express_1.default.json());
    // Configure CORS properly for production
    app.use((0, cors_1.default)({
        origin: ["https://getSafty.vercel.app"], //Frontend link
        methods: ["POST", "GET", "UPDATE", "DELETE"],
        credentials: true,
    }));
    app.use((0, redAlert_middleware_1.default)(exports.io));
    exports.io.on("connection", (socket) => {
        console.log("connection", socket.id);
        socket.on("disconnect", () => {
            console.log("disconnect");
        });
    });
    // Routes
    app.use("/api/auth", auth_route_1.authRoutes);
    app.use("/api/room", rooms_route_1.roomsRoutes);
    app.use("/api/alert", red_alert_route_1.alertRoute);
    // displaied if connected successfuly
    app.get("/", (req, res) => res.json("Express on Vercel"));
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
main();
