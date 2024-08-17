"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const safeRoomSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        city: {
            type: String,
            required: true,
            trim: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
        floor: {
            type: String,
            trim: true,
        },
        apartment: {
            type: String,
            trim: true,
        },
    },
    location: {
        lng: {
            type: Number,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
    },
    images: [{
            type: String,
        }],
    capacity: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    accessible: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const SafeRoom = (0, mongoose_1.model)('SafeRoom', safeRoomSchema);
exports.default = SafeRoom;
