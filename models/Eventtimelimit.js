const mongoose = require("mongoose");

const EventtimelimitSchema = new mongoose.Schema(
    {
        minutes: {
            type: Number
        },
        seconds: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Eventtimelimit = mongoose.model("Eventtimelimit", EventtimelimitSchema);
module.exports = Eventtimelimit