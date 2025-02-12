const mongoose = require("mongoose");

const StaffUserwalletsSchema = new mongoose.Schema(
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

const StaffUserwallets = mongoose.model("StaffUserwallets", StaffUserwalletsSchema)
module.exports = StaffUserwallets