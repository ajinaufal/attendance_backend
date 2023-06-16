const mongoose = require("mongoose");
const AttendanceSchema = new mongoose.Schema({
    user_token: {
        type: String,
        required: true,
    },
    inAt: {
        type: Date,

        nullable: true,
    },
    outAt: {
        type: Date,
        nullable: true,
    },
    createdAt: {
        type: Date,

        nullable: true,
    },
    updatedAt: {
        type: Date,

        nullable: true
    },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;