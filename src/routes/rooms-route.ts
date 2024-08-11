import { Router } from "express";
import {
    getAllRooms,
    getRoomById
} from "../controllers/rooms-controller";

export const roomsRoutes = Router();

// Public routes
roomsRoutes.get("/", getAllRooms);
roomsRoutes.get("/:id", getRoomById);
