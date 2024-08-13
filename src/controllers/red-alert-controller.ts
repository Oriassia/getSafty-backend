import { Socket } from "socket.io";
import { io } from "..";
import { NextFunction } from "express";
import { CustomRequest } from "./auth-controller";

var pikudHaoref = require("pikud-haoref-api");
var interval = 5000;
export var poll = function () {
  var options = {};
  // Get currently active alert
  pikudHaoref.getActiveAlert(function (err: Error, alert: any) {
    setTimeout(poll, interval);
    if (err) {
      return console.log("Retrieving active alert failed: ", err);
    }
    if (alert.type != "none") {
      console.log("Currently active alert:");
      console.log(alert);
      io.emit("alert", alert);
    }
  }, options);
};
