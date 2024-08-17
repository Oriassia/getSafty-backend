"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poll = void 0;
const __1 = require("..");
var pikudHaoref = require("pikud-haoref-api");
var interval = 5000;
var poll = function () {
    var options = {};
    // Get currently active alert
    pikudHaoref.getActiveAlert(function (err, alert) {
        setTimeout(exports.poll, interval);
        if (err) {
            return console.log("Retrieving active alert failed: ", err);
        }
        if (alert.type != "none") {
            console.log("Currently active alert:");
            console.log(alert);
            __1.io.emit("alert", alert);
        }
    }, options);
};
exports.poll = poll;
