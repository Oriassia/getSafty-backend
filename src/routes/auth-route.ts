import { Router } from "express";
import {
    register,
    login,
    getUserById

} from "../controllers/auth-controller";

export const authRoutes = Router();

// Public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

authRoutes.get("/:id", getUserById);
