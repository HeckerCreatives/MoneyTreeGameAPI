const mongoose = require("mongoose");

const PlayerevententrylimitSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        limit: {
            type: Number,
        },
    },
    {
        timestamps: true
    }
)

const Playerevententrylimit = mongoose.model("Playerevententrylimit", PlayerevententrylimitSchema);
module.exports = Playerevententrylimit