"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRooms = getAllRooms;
exports.getRoomById = getRoomById;
exports.addRoom = addRoom;
exports.updateRoom = updateRoom;
exports.deleteRoom = deleteRoom;
exports.getFavoritesByUser = getFavoritesByUser;
exports.addToFavorites = addToFavorites;
exports.removeFromFavorites = removeFromFavorites;
exports.getUserRooms = getUserRooms;
exports.getNearestZone = getNearestZone;
exports.toggleFavorite = toggleFavorite;
const room_model_1 = __importDefault(require("../models/room-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const zone_model_1 = __importDefault(require("../models/zone-model"));
async function getAllRooms(req, res) {
    try {
        const { accessible, open, radius, lat, lng, isPublic } = req.query;
        let query = {};
        // Filtering by accessibility, availability, and public status
        if (accessible === "true") {
            query.accessible = true;
        }
        if (open === "true") {
            query.available = true;
        }
        if (isPublic === "true") {
            query.isPublic = true;
        }
        // Handling radius-based filtering using MongoDB's geospatial queries
        if (radius && lat && lng) {
            const radiusInMeters = parseFloat(radius) / 6378.1; // Earth radius in kilometers
            query.location = {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(lng), parseFloat(lat)],
                        radiusInMeters,
                    ],
                },
            };
        }
        // Execute the query to find matching rooms
        const rooms = await room_model_1.default.find(query);
        res.status(200).json({ rooms });
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
}
async function getRoomById(req, res) {
    const { id } = req.params;
    try {
        const room = await room_model_1.default.findById(id);
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        res.status(200).json({ room });
    }
    catch (error) {
        console.error("Error fetching room by ID:", error);
        res.status(500).json({ error: "Failed to fetch room" });
    }
}
async function addRoom(req, res) {
    const ownerId = req.userId;
    const { title, address, location, images, capacity, description, available, accessible, isPublic, } = req.body;
    try {
        if (!title || !address || !location || !capacity || !description) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const newRoom = new room_model_1.default({
            title,
            address,
            location,
            images,
            capacity,
            ownerId,
            description,
            available,
            accessible,
            isPublic,
        });
        const savedRoom = await newRoom.save();
        res.status(201).json({ room: savedRoom });
    }
    catch (error) {
        console.error("Error adding room:", error);
        res.status(500).json({ error: "Failed to add room" });
    }
}
async function updateRoom(req, res) {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.userId;
    try {
        const room = await room_model_1.default.findById(id);
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        if (room.ownerId.toString() !== userId) {
            res.status(403).json({ error: "Permission denied" });
            return;
        }
        const updatedRoom = await room_model_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ room: updatedRoom });
    }
    catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ error: "Failed to update room" });
    }
}
async function deleteRoom(req, res) {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const room = await room_model_1.default.findById(id);
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        if (room.ownerId.toString() !== userId) {
            res.status(403).json({ error: "Permission denied" });
            return;
        }
        await room_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Room deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ error: "Failed to delete room" });
    }
}
async function getFavoritesByUser(req, res) {
    const { userId } = req.params;
    try {
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        let favRooms = [];
        if (user) {
            for (const favId of user.favorites) {
                const room = await room_model_1.default.findById(favId);
                if (room) {
                    favRooms.push(room);
                }
            }
        }
        res.status(200).json({ favRooms });
    }
    catch (error) {
        console.error("Error fetching user rooms:", error);
        res.status(500).json({ error: "Failed to fetch user rooms" });
    }
}
async function addToFavorites(req, res) {
    const { roomId } = req.params;
    const userId = req.userId;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
            res.status(400).json({ error: "Invalid room ID" });
            return;
        }
        const roomObjectId = new mongoose_1.default.Types.ObjectId(roomId);
        const room = await room_model_1.default.findById(roomObjectId);
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const roomObjectIdStr = roomObjectId.toString();
        if (user.favorites.some((favorite) => favorite.toString() === roomObjectIdStr)) {
            res.status(400).json({ error: "Room is already in favorites" });
            return;
        }
        user.favorites.push(roomObjectId); // Use 'as any' if necessary to bypass strict type checking
        await user.save();
        res.status(200).json({ message: "Room added to favorites successfully" });
    }
    catch (error) {
        console.error("Error adding room to favorites:", error);
        res.status(500).json({ error: "Failed to add room to favorites" });
    }
}
async function removeFromFavorites(req, res) {
    const { roomId } = req.params;
    const userId = req.userId;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
            res.status(400).json({ error: "Invalid room ID" });
            return;
        }
        const roomObjectId = new mongoose_1.default.Types.ObjectId(roomId);
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const roomIndex = user.favorites.findIndex((favorite) => favorite.toString() === roomObjectId.toString());
        if (roomIndex === -1) {
            res.status(400).json({ error: "Room is not in favorites" });
            return;
        }
        user.favorites.splice(roomIndex, 1);
        await user.save();
        res
            .status(200)
            .json({ message: "Room removed from favorites successfully" });
    }
    catch (error) {
        console.error("Error removing room from favorites:", error);
        res.status(500).json({ error: "Failed to remove room from favorites" });
    }
}
async function getUserRooms(req, res) {
    const { userId } = req.params;
    try {
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const userRooms = await room_model_1.default.find({ ownerId: userId });
        if (userRooms.length === 0) {
            res.status(200).json({ userRooms: [] });
            return;
        }
        res.status(200).json({ userRooms });
    }
    catch (error) {
        console.error("Error fetching user rooms:", error);
        res.status(500).json({ error: "Failed to fetch user rooms" });
    }
}
// Haversine formula to calculate the distance between two geographic coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
async function getNearestZone(req, res) {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        console.log("Latitude and Longitude are required");
        res.status(400).json({ message: "Latitude and Longitude are required" });
        return;
    }
    try {
        const zones = await zone_model_1.default.find();
        if (zones.length === 0) {
            console.log("No zones found");
            res.status(404).json({ message: "No zones found" });
            return;
        }
        let nearestZone = null;
        let minDistance = Infinity;
        zones.forEach((zone) => {
            const distance = calculateDistance(parseFloat(lat), parseFloat(lng), zone.location.lat, zone.location.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestZone = zone;
            }
        });
        if (nearestZone) {
            res.json(nearestZone); // Return the nearest zone
        }
        else {
            console.log("No nearby zones found");
            res.status(404).json({ message: "No nearby zones found" });
        }
    }
    catch (error) {
        console.error("Error fetching nearest zone:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function toggleFavorite(req, res) {
    const { roomId } = req.params;
    const userId = req.userId;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
            res.status(400).json({ error: "Invalid room ID" });
            return;
        }
        const roomObjectId = new mongoose_1.default.Types.ObjectId(roomId);
        const room = await room_model_1.default.findById(roomObjectId);
        if (!room) {
            res.status(404).json({ error: "Room not found" });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const roomIndex = user.favorites.findIndex((favorite) => favorite.toString() === roomObjectId.toString());
        if (roomIndex === -1) {
            // Room is not in favorites, so add it
            user.favorites.push(roomObjectId); // Cast to `any` or to `mongoose.Schema.Types.ObjectId` if necessary
            await user.save();
            res.status(200).json({
                message: "Room added to favorites successfully",
                state: true,
            });
        }
        else {
            // Room is already in favorites, so remove it
            user.favorites.splice(roomIndex, 1);
            await user.save();
            res.status(200).json({
                message: "Room removed from favorites successfully",
                state: false,
            });
        }
    }
    catch (error) {
        console.error("Error toggling favorite status:", error);
        res.status(500).json({ error: "Failed to toggle favorite status" });
    }
}
