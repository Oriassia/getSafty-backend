import { Server } from "socket.io";
import { Response, NextFunction, Request } from "express";

// Extending Express's Request type
export interface CustomRequest extends Request {
  io?: Server;
}

const socketMiddleware =
  (io: Server) => (req: CustomRequest, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };

export default socketMiddleware;
