const { RaffleWinner } = require("../models/Raffle")


exports.getCurrentWinner = async (req, res) => {
    const { id } = req.user

    const data = await RaffleWinner.findOne({})
        .populate("owner", "username")
        .sort({ createdAt: -1 })
        .then(data => data)
        .catch(err => {
            console.error("Error fetching current winner:", err);
            return null;
        });

    if (!data) {
        return res.status(200).json({ message: "failed",  data: "No current winner found" });
    }

    let finaldata
    
    if (data && data.eventname === "Buffer") {
        return res.status(200).json({ message: "failed",  data: "No current winner found" });
    }
    
    finaldata = {
        _id: data._id,
        username: data.owner.username,
        eventname: data.eventname,
        index: data.index,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    }

    return res.status(200).json({
        message: "success",
        data: finaldata
    });
}