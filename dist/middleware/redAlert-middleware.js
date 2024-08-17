"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketMiddleware = (io) => (req, res, next) => {
    req.io = io;
    next();
};
exports.default = socketMiddleware;
