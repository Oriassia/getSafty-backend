import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import { IUser } from '../models/user-model';

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response): Promise<void> {
    console.log('register');
    try {
        const { password, firstName, lastName, email, phoneNumber } = req.body;

        if (!password || !firstName || !lastName || !email || !phoneNumber) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = new User({
            password: hashedPassword,
            firstName,
            lastName,
            email,
            phoneNumber,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        console.error('register', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({ error: 'Validation failed', details: validationErrors });
            return;
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
            return;
        }

        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
}


export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }) as IUser;
        if (!user) {
            res.status(401).json({ error: 'Authentication failed' });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ error: 'Authentication failed' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
            expiresIn: '1h',
        });

        console.log(token);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
        const user = await User.findById(id) as IUser;
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}
