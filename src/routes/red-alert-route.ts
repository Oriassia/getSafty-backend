import { Router } from "express";
import { poll } from "../controllers/red-alert-controller";

export const alertRoute = Router();

// Route to get the nearest zone based on location
alertRoute.get("/", poll); // Added this line
