import { Socket } from "socket.io";
import { io } from "..";

var pikudHaoref = require("pikud-haoref-api");

// Set polling interval in milliseconds (now set to 500ms)
var interval = 5000;

// Define polling function
export var poll = function () {
  // Optional Israeli proxy if running outside Israeli borders
  var options = {};

  // Get currently active alert
  pikudHaoref.getActiveAlert(function (err: Error, alert: any) {
    // Schedule polling in X millis
    setTimeout(poll, interval);

    // Log errors
    if (err) {
      return console.log("Retrieving active alert failed: ", err);
    }

    // Alert header

    // Log the alert (if any)
    if (alert.type != "none") {
      console.log("Currently active alert:");
      console.log(alert);
      console.log();
      io.emit("alert", alert);
    }
    // Line break for readability
  }, options);
};

// Start polling for active alert
poll();
