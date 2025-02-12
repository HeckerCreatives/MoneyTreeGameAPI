const { default: mongoose } = require("mongoose");
const Leaderboard = require("../models/Leaderboard");
const Maintenance = require("../models/Maintenance");


// game api
exports.getLeaderboard = async (req, res) => {
    const { id, username } = req.user;

    await Leaderboard.find({})
        .populate('owner')
        .sort({ amount: -1 })
        .limit(10)
        .then(async (top10) => {
            const user = await Leaderboard.findOne({ owner: new mongoose.Types.ObjectId(id) });

            if (!user) {
                return res.json({ message: "failed", data: "No leaderboard found" });
            }

            const eventmainte = await Maintenance.findOne({ type: "eventgame" });
            const userRank = await Leaderboard.countDocuments({ amount: { $gt: user.amount } });
            const finaldata = {
                topplayers: top10.reduce((acc, item, index) => {
                    acc[index + 1] = {
                        player_name: item.owner.username,
                        player_score: item.amount
                    };
                    return acc;
                }, {}),
                user: {
                    rank: userRank + 1,
                    player_name: user.owner.username,
                    player_score: user.amount
                },
                event: {
                    type: eventmainte.type,
                    value: eventmainte.value
                }
            };

            return res.json({ message: "success", data: finaldata });
        })
        .catch(err => {
            console.log(`There's a problem getting the leaderboard for ${username}. Error ${err}`);
            return res.json({ message: "bad-request", data: "There's a problem getting the leaderboard. Please contact customer support." });
        });
};
exports.sendeventpoints = async (req, res) => {
    const { id, username } = req.user
    const { pts } = req.body

    if (!pts || isNaN(pts) || pts < 0){
        return res.json({ message: "bad-request", data: "Invalid amount" });
    }

    const user = await Leaderboard.findOne({ owner: new mongoose.Types.ObjectId(id) })

    if (!user){
        return res.json({ message: "failed", data: "No leaderboard found" });
    }

    user.amount += pts
    await user.save()

    return res.json({ message: "success" });  
}