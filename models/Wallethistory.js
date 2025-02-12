const mongoose = require("mongoose");

const walletHistorySchema = new mongoose.Schema(
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
            type: Number,
            index: true // Automatically creates an index on 'amount'
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        bankname: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        banktype: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        }
    },
    {
        timestamps: true
    }
)

const Wallethistory = mongoose.model("Wallethistory", walletHistorySchema)
module.exports = Wallethistory