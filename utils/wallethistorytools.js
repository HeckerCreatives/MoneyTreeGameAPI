const { default: mongoose } = require("mongoose");
const Wallethistory = require("../models/Wallethistory")

exports.addwallethistory = async (id, type, amount, from, trainername, trainerrank) => {
    const history = await Wallethistory.create({owner: new mongoose.Types.ObjectId(id), type: type, amount: amount, from: new mongoose.Types.ObjectId(from), trainername: trainername, trainerrank: trainerrank})
    .catch(err => {

        console.log(`Failed to create wallet history data for ${id} type: ${type} price: ${amount}, error: ${err}`)

        return {
            message: "bad-request"
        }
    })

    return {
        message: "success",
        data: {
            transactionid: history._id
        }
    }
}