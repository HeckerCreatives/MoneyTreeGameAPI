const { default: mongoose } = require("mongoose")
const Conversionrate = require("../models/Conversionrate")
const Inventoryhistory = require("../models/Inventoryhistory")


exports.saveinventoryhistory = async(id, trainername, rank, historytype, amount) => {
    const history = await Inventoryhistory.create({owner: new mongoose.Types.ObjectId(id), trainername: trainername, type: historytype, rank: rank, amount: amount})
    .catch(err => {
        return {
            message: "bad-request"
        }
    })

    return {
        message: "success",
        data: {
            transactionid: history._id,
            type: history.type,
            name: history.trainername,
            rank: history.rank,
            amount: history.amount
            
        }
    }
}

exports.getfarm = (timestarted, unixtime, maxtotal) => {
    // Start time and expiration time in Unix timestamps
    const startTime = parseFloat(timestarted);
    const expirationTime = parseFloat(unixtime);

    // Get the current time in Unix timestamp format
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // Maximum total coins to be farmed
    const maxTotalCoins = parseFloat(maxtotal);

    // Calculate total farming duration in seconds
    const totalFarmingDuration = expirationTime - startTime;

    // Calculate coins per hour
    const coinsPerHour = (maxTotalCoins / (totalFarmingDuration / 3600));

    // Calculate current time between start time and expiration time in seconds
    const currentTimeBetween = Math.min(currentTime - startTime, totalFarmingDuration); // Consider current time up to expiration

    // Calculate total coins farmed
    const totalCoinsFarmed = Math.min((currentTimeBetween / 3600 * coinsPerHour), maxTotalCoins);

    return totalCoinsFarmed
}