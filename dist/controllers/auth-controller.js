"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getUserById = getUserById;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user-model"));
const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;
async function register(req, res) {
    try {
        const { password, firstName, lastName, email, phoneNumber } = req.body;
        if (!password || !firstName || !lastName || !email || !phoneNumber) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Email already in use" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = new user_model_1.default({
            password: hashedPassword,
            firstName,
            lastName,
            email,
            phoneNumber,
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("register", error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res
                .status(400)
                .json({ error: "Validation failed", details: validationErrors });
            return;
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({
                error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
            });
            return;
        }
        res
            .status(500)
            .json({ error: "Registration failed. Please try again later." });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = (await user_model_1.default.findOne({ email }));
        if (!user) {
            console.log("cant find email");
            res.status(401).json({ error: "Authentication failed" });
            return;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("error2");
            res.status(401).json({ error: "Authentication failed" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Login failed" });
    }
}
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = (await user_model_1.default.findById(id));
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ user: userWithoutPassword });
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
}
