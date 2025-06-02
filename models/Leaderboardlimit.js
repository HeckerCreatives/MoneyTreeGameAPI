const mongoose = require("mongoose");

const LeaderboardlimitSchema = new mongoose.Schema(
    {
        limit: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Leaderboardlimit = mongoose.model("Leaderboardlimit", LeaderboardlimitSchema);
module.exports = Leaderboardlimit