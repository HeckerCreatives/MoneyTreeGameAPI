const { default: mongoose } = require("mongoose");


const BankSchema = new mongoose.Schema(
    {
        type: {
            type: String,
        },
        name: {
            type: String,
        },
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
        profit: {
            type: Number,
            default: 0.2,
        },
        duration: {
            type: Number,
            default: 7,
        },
        b1t1: {
            type: String
        },
        islocked: {
            type: String
        }
    },
    {
        tiimestamps: true,
    }
)

const Bank = mongoose.model("Bank", BankSchema)
module.exports = Bank