const mongoose = require("mongoose");

const UserwalletsSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        type: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        amount: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Userwallets = mongoose.model("Userwallets", UserwalletsSchema)
module.exports = Userwallets