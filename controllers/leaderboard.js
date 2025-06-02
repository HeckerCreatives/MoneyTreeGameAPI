const { default: mongoose } = require("mongoose");
const Leaderboard = require("../models/Leaderboard");
const Maintenance = require("../models/Maintenance");
const Leaderboardlimit = require("../models/Leaderboardlimit");
const Playerevententrylimit = require("../models/Playerevententrylimit")
const Evententrylimit = require("../models/Evententrylimit")


// game api
exports.getLeaderboard = async (req, res) => {
    const { id, username } = req.user;

    const templimit = await Leaderboardlimit.find()

    let finallimit = 10

    if (templimit.length > 0){
        finallimit = templimit[0].limit
    }

    const eventEntryLimit = await Evententrylimit.findOne();
    const defaultLimit = eventEntryLimit ? eventEntryLimit.limit : 0;

    
    const user = await Leaderboard.findOne({ owner: new mongoose.Types.ObjectId(id) });
    let eventmainte = await Maintenance.findOne({ type: "eventgame" });

    if (!eventmainte) {
        eventmainte = await Maintenance.create({
            type: "eventgame",
            value: "0"
        });
    }
    const userRank = await Leaderboard.countDocuments({ amount: { $gt: !user ? 0 : user.amount } });
    
    let entrylimit = await Playerevententrylimit.findOne({owner: new mongoose.Types.ObjectId(id)})

    if (!entrylimit){
        entrylimit = await Playerevententrylimit.create({owner: new mongoose.Types.ObjectId(id), limit: defaultLimit})
    }
    const topplayers = await Leaderboard.aggregate([
        // Sort by score descending
        { $sort: { amount: -1 } },
        // Limit based on leaderboard limit
        { $limit: finallimit },
        // Lookup user data
        {
            $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerData"
            }
        },
        { $unwind: "$ownerData" },
        // Lookup player entry limit
        {
            $lookup: {
            from: "playerevententrylimits", // collection name (usually lowercase plural)
            localField: "owner",
            foreignField: "owner",
            as: "playerLimit"
            }
        },
        {
            $addFields: {
            playerLimit: { $arrayElemAt: ["$playerLimit.limit", 0] }
            }
        },
        {
            $addFields: {
            entrylimit: { $ifNull: ["$playerLimit", defaultLimit] }
            }
        },
        // Format output
        {
            $project: {
            _id: 0,
            player_name: "$ownerData.username",
            player_score: "$amount",
            entrylimit: 1
            }
        }
    ]);

    const topplayersObject = {};
    topplayers.forEach((player, index) => {
        topplayersObject[index + 1] = player;
    });

    const finaldata = {
        topplayers: topplayersObject,
        user: {
            rank: !user ? "No rank yet" : userRank + 1,
            player_score: !user ? "No rank yet" : user.amount
        },
        event: {
            type: eventmainte.type,
            value: eventmainte.value
        },
        lblimit: finallimit,
        entrylimit: entrylimit ? entrylimit.limit : 0
    };

    return res.json({message: "success", data: finaldata})
};

exports.sendeventpoints = async (req, res) => {
    const { id, username } = req.user
    const { pts } = req.body

    if (!pts || isNaN(pts) || pts < 0){
        return res.json({ message: "bad-request", data: "Invalid amount" });
    }

    const datalimit = await Evententrylimit.find()

    let limit = 0;
    
    if (datalimit.length > 0){
        limit = datalimit[0].limit
    }

    let entrylimit = await Playerevententrylimit.findOne({owner: new mongoose.Types.ObjectId(id)})

    if (!entrylimit){
        entrylimit = await Playerevententrylimit.create({owner: new mongoose.Types.ObjectId(id), limit: limit})
    }


    const user = await Leaderboard.findOne({ owner: new mongoose.Types.ObjectId(id) })

    if (!user){
        await Leaderboard.create({owner: new mongoose.Types.ObjectId(id), amount: pts})
        return res.json({ message: "success" });  
    }

    user.amount += pts

    entrylimit.limit -= 1;
    await user.save()
    await entrylimit.save()

    return res.json({ message: "success" });  
}