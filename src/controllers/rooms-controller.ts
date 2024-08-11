import { Request, Response } from "express";
import SafeRoom from "../models/room-model";
import User from "../models/user-model";
import mongoose, { Types } from "mongoose";

export interface CustomRequest extends Request {
  userId?: string;
}

export async function getAllRooms(req: Request, res: Response): Promise<void> {
  try {
    const { accessible, open, radius, lat, lng, isPublic } = req.query;

    let query: any = {};
    console.log(req.query);

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
      const radiusInMeters = parseFloat(radius as string) / 6378.1; // Earth radius in kilometers

      query.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng as string), parseFloat(lat as string)],
            radiusInMeters,
          ],
        },
      };
    }

    // Execute the query to find matching rooms
    const rooms = await SafeRoom.find(query);
    res.status(200).json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

export async function getRoomById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const room = await SafeRoom.findById(id);
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
}

export async function addRoom(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const ownerId = req.userId;
  const {
    title,
    address,
    location,
    images,
    capacity,
    description,
    available,
    accessible,
    isPublic,
  } = req.body;

  try {
    if (!title || !address || !location || !capacity || !description) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newRoom = new SafeRoom({
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
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
}

export async function updateRoom(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.userId;

  try {
    const room = await SafeRoom.findById(id);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    if (room.ownerId.toString() !== userId) {
      res.status(403).json({ error: "Permission denied" });
      return;
    }

    const updatedRoom = await SafeRoom.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ room: updatedRoom });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
}

export async function deleteRoom(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const room = await SafeRoom.findById(id);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    if (room.ownerId.toString() !== userId) {
      res.status(403).json({ error: "Permission denied" });
      return;
    }

    await SafeRoom.findByIdAndDelete(id);

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
}

export async function getFavoritesByUser(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { userId } = req.params;

  try {
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const user = await User.findById(userId);
    if (user?.favorites.length === 0) {
      res.status(404).json({ message: "No favourites found for this user" });
      return;
    }
    let favRooms: any = [];
    user?.favorites.forEach(async (favId) => {
      const room = await SafeRoom.findById(favId);
      if (room) {
        favRooms.push(room);
      }
    });
    res.status(200).json({ favRooms });
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    res.status(500).json({ error: "Failed to fetch user rooms" });
  }
}

export async function addToFavorites(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { roomId } = req.params;
  const userId = req.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400).json({ error: "Invalid room ID" });
      return;
    }

    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    const room = await SafeRoom.findById(roomObjectId);
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const roomObjectIdStr = roomObjectId.toString();
    if (
      user.favorites.some((favorite) => favorite.toString() === roomObjectIdStr)
    ) {
      res.status(400).json({ error: "Room is already in favorites" });
      return;
    }

    user.favorites.push(roomObjectId as any); // Use 'as any' if necessary to bypass strict type checking
    await user.save();

    res.status(200).json({ message: "Room added to favorites successfully" });
  } catch (error) {
    console.error("Error adding room to favorites:", error);
    res.status(500).json({ error: "Failed to add room to favorites" });
  }
}

export async function removeFromFavorites(
  req: CustomRequest,
  res: Response
): Promise<void> {
  const { roomId } = req.params;
  const userId = req.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400).json({ error: "Invalid room ID" });
      return;
    }

    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const roomIndex = user.favorites.findIndex(
      (favorite) => favorite.toString() === roomObjectId.toString()
    );
    if (roomIndex === -1) {
      res.status(400).json({ error: "Room is not in favorites" });
      return;
    }

    user.favorites.splice(roomIndex, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Room removed from favorites successfully" });
  } catch (error) {
    console.error("Error removing room from favorites:", error);
    res.status(500).json({ error: "Failed to remove room from favorites" });
  }
}

export async function getUserRooms(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  try {
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const userRooms = await SafeRoom.find({ ownerId: userId });

    if (userRooms.length === 0) {
      res.status(404).json({ message: "No rooms found for this user" });
      return;
    }

    res.status(200).json({ userRooms });
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    res.status(500).json({ error: "Failed to fetch user rooms" });
  }
}
