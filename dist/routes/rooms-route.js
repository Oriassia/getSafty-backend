"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsRoutes = void 0;
const express_1 = require("express");
const rooms_controller_1 = require("../controllers/rooms-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
exports.roomsRoutes = (0, express_1.Router)();
// Route to get the nearest zone based on location
exports.roomsRoutes.get("/zones/nearest", rooms_controller_1.getNearestZone); // Added this line
// Public routes
exports.roomsRoutes.get("/", rooms_controller_1.getAllRooms);
exports.roomsRoutes.get("/:id", rooms_controller_1.getRoomById);
// Protected routes
exports.roomsRoutes.post("/", auth_middleware_1.verifyToken, rooms_controller_1.addRoom);
exports.roomsRoutes.patch("/:id", auth_middleware_1.verifyToken, rooms_controller_1.updateRoom);
exports.roomsRoutes.delete("/:id", auth_middleware_1.verifyToken, rooms_controller_1.deleteRoom);
exports.roomsRoutes.get("/user/:userId", auth_middleware_1.verifyToken, rooms_controller_1.getUserRooms);
exports.roomsRoutes.get("/user/fav/:userId", rooms_controller_1.getFavoritesByUser);
exports.roomsRoutes.post("/favorite/:roomId", auth_middleware_1.verifyToken, rooms_controller_1.addToFavorites);
exports.roomsRoutes.delete("/favorite/:roomId", auth_middleware_1.verifyToken, rooms_controller_1.removeFromFavorites);
exports.roomsRoutes.patch("/favorite/:roomId", auth_middleware_1.verifyToken, rooms_controller_1.toggleFavorite);
