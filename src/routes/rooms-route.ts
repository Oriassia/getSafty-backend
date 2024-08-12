import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
  addRoom,
  updateRoom,
  deleteRoom,
  addToFavorites,
  removeFromFavorites,
  getUserRooms,
  getFavoritesByUser,
  toggleFavorite,
} from "../controllers/rooms-controller";
import { verifyToken } from "../middleware/auth-middleware";

export const roomsRoutes = Router();

// Public routes
roomsRoutes.get("/", getAllRooms);
roomsRoutes.get("/:id", getRoomById);

// Protected routes
roomsRoutes.post("/", verifyToken, addRoom);
roomsRoutes.patch("/:id", verifyToken, updateRoom);
roomsRoutes.delete("/:id", verifyToken, deleteRoom);
roomsRoutes.get("/user/:userId", verifyToken, getUserRooms);
roomsRoutes.get("/user/fav/:userId", getFavoritesByUser);
roomsRoutes.post("/favorite/:roomId", verifyToken, addToFavorites);
roomsRoutes.delete("/favorite/:roomId", verifyToken, removeFromFavorites);
roomsRoutes.patch("/favorite/:roomId", verifyToken, toggleFavorite);
