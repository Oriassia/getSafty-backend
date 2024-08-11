import express, { Request, Response, Express } from 'express';
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from './routes/auth-route';

const app: Express = express();
const PORT = 3000;

async function main() {
    // Connect to database
    await connectDB();

    // Middleware
    app.use(express.json());
    app.use(cors()); // Configure CORS properly for production

    // Routes
    app.use("/api/auth", authRoutes);


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

main();
