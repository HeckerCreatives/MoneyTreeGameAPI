const { default: mongoose } = require("mongoose");


const WalletConversionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            index: true // Automatically creates an index on 'index'
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
        timestamps: true,
    }
)

const Walletconversion = mongoose.model("Walletconversion", WalletConversionSchema)
module.exports = Walletconversion