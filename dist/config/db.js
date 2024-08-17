"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
// config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load env vars
async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error("MongoDB connection error:", err instanceof Error ? err.message : String(err));
        process.exit(1); // Exit process with failure
    }
}
