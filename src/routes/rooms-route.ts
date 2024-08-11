import { Router } from "express";
import {
    getAllRooms,
    getRoomById,
    addRoom
} from "../controllers/rooms-controller";
import { verifyToken } from "../middleware/auth-middleware";

export const roomsRoutes = Router();

// Public routes
roomsRoutes.get("/", getAllRooms);
roomsRoutes.get("/:id", getRoomById);

// Protected routes
roomsRoutes.post("/", verifyToken, addRoom);