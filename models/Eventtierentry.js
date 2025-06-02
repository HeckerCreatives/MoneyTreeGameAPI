const mongoose = require("mongoose");

const EventtierentrySchema = new mongoose.Schema(
    {
        type: {
            type: String,
        },
        status: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
)

const Eventtierentry = mongoose.model("Eventtierentry", EventtierentrySchema);
module.exports = Eventtierentry