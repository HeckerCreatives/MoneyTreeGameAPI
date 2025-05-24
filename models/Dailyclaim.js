const { default: mongoose } = require("mongoose");


const DailyclaimSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        inventory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
        },
        amount: {
            type: Number,
            index: true // Automatically creates an index on 'amount'
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }, { timestamps: true }
)

const Dailyclaim = mongoose.model("Dailyclaim", DailyclaimSchema)
module.exports = Dailyclaim