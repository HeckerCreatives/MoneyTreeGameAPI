const mongoose = require("mongoose");

const inventoryHistorySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'amount'
        },
        bankname: {
            type: String
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

const Inventoryhistory = mongoose.model("Inventoryhistory", inventoryHistorySchema)
module.exports = Inventoryhistory