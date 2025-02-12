const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        processby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staffusers",
            index: true // Automatically creates an index on 'amount'
        },
        status: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        value: {
            type: Number
        },
        type: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        paymentmethod: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        accountname: {
            type: String
        },
        accountnumber: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Payout = mongoose.model("Payout", PayoutSchema);
module.exports = Payout