import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

interface CustomRequest extends Request {
    userId?: string; // Add userId to the request object
}

function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    // Split the token from the header (Bearer token)
    const authHeader = req.headers['authorization'] as string | undefined; // Get the authorization header and cast to string or undefined

    if (!authHeader) {
        console.log('auth.middleware, verifyToken. No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.split(' ')[1]; // Get the token from the header

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload; // Verify token
        req.userId = decoded.userId as string; // Add userId to request object
        next(); // Call next middleware
    } catch (error) {
        console.log(
            'auth.middleware, verifyToken. Error while verifying token',
            error
        );
        res.status(401).json({ error: 'Invalid token' });
    }
}

export { verifyToken };
