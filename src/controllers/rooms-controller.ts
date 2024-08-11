import { Request, Response } from 'express';
import SafeRoom from '../models/room-model'; // Adjust the import path according to your project structure

export async function getAllRooms(req: Request, res: Response): Promise<void> {
    try {
        const rooms = await SafeRoom.find(); // Fetch all rooms from the database
        res.status(200).json({ rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
}

export async function getRoomById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const room = await SafeRoom.findById(id); // Fetch room by ID
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.status(200).json({ room });
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
}
