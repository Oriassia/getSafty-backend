"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zoneSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    countdown: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
const Zone = (0, mongoose_1.model)('Zone', zoneSchema);
exports.default = Zone;
