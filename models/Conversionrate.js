const mongoose = require("mongoose");

const convertsionRateSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            index: true // Automatically creates an index on 'amount'
        },
    },
    {
        timestamps: true
    }
)

const Conversionrate = mongoose.model("Conversionrate", convertsionRateSchema);
module.exports = Conversionrate