"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    safeRooms: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'SafeRoom',
        }],
    favorites: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'SafeRoom',
        }],
    phoneNumber: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
