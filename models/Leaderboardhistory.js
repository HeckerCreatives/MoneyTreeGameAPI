const mongoose = require("mongoose");

const leaderboardHistorySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        eventname: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        amount: {
            type: Number
        },
        date: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const LeaderboardHistory = mongoose.model("LeaderboardHistory", leaderboardHistorySchema)
module.exports = LeaderboardHistory