const { default: mongoose } = require("mongoose");


const SelectedPlayerSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    },
    {
        timestamps: true,
    }
)

const RaffleWinnerSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        eventname: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            index: true,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
)


const SelectedPlayer = mongoose.model("SelectedPlayer", SelectedPlayerSchema);
const RaffleWinner = mongoose.model("RaffleWinner", RaffleWinnerSchema);

module.exports = {
    SelectedPlayer,
    RaffleWinner
};