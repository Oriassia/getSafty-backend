import { Request, Response } from 'express';
import SafeRoom from '../models/room-model';

export interface CustomRequest extends Request {
    userId?: string;
}

export async function getAllRooms(req: Request, res: Response): Promise<void> {
    try {
        const rooms = await SafeRoom.find();
        res.status(200).json({ rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
}

export async function getRoomById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const room = await SafeRoom.findById(id);
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

// export async function addRoom(req: CustomRequest, res: Response): Promise<void> {
//     const ownerId = req.userId;
//     const {
//         address,
//         location,
//         images,
//         capacity,
//         description,
//         available,
//         accessible,
//         isPublic
//     } = req.body;

//     try {

//         if (!address || !location || !capacity || !description) {
//             res.status(400).json({ error: 'Missing required fields' });
//             return;
//         }

//         const newRoom = new SafeRoom({
//             address,
//             location,
//             images,
//             capacity,
//             ownerId,
//             description,
//             available,
//             accessible,
//             isPublic
//         });

//         const savedRoom = await newRoom.save();

//         res.status(201).json({ room: savedRoom });
//     } catch (error) {
//         console.error('Error adding room:', error);
//         res.status(500).json({ error: 'Failed to add room' });
//     }
// }


export async function addRoom(req: CustomRequest, res: Response): Promise<void> {


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
        isPublic
    } = req.body;

    try {
        if (!title || !address || !location || !capacity || !description) {
            res.status(400).json({ error: 'Missing required fields' });
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
            isPublic
        });

        const savedRoom = await newRoom.save();

        res.status(201).json({ room: savedRoom });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ error: 'Failed to add room' });
    }
}

