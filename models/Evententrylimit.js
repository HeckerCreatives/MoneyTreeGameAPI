const mongoose = require("mongoose");

const EvententrylimitSchema = new mongoose.Schema(
    {
        limit: {
            type: Number,
        },
    },
    {
        timestamps: true
    }
)

const Evententrylimit = mongoose.model("Evententrylimit", EvententrylimitSchema);
module.exports = Evententrylimit