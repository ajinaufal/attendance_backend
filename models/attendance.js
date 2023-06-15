const mongoose = require("mongoose");
const AttendanceSchema = new mongoose.Schema({
    user_token: {
        type: String,
        required: true,
    },
    inAt: {
        type: String,

        nullable: true,
    },
    outAt: {
        type: String,

        nullable: true,
    },
    createdAt: {
        type: String,

        nullable: true,
    },
    updatedAt: {
        type: String,

        nullable: true
    },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;