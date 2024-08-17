"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertRoute = void 0;
const express_1 = require("express");
const red_alert_controller_1 = require("../controllers/red-alert-controller");
exports.alertRoute = (0, express_1.Router)();
// Route to get the nearest zone based on location
exports.alertRoute.get("/", red_alert_controller_1.poll); // Added this line
