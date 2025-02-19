const { default: mongoose } = require("mongoose")
const Inventory = require("../models/Inventory");
const Bank = require("../models/Bank");
exports.getgameinventory = async (req, res) => {
    const { id, username } = req.user;

    try {
        const data = await Inventory.find({ owner: new mongoose.Types.ObjectId(id) })
            .sort({ rank: -1 });

        if (!data || data.length === 0) {
            return res.json({ message: "failed", data: "No inventory found" });
        }

        const totalplans = data.length;

        const finaldata = await Promise.all(data.map(async (item, index) => {
            const bank = await Bank.findOne({ type: item.type });

            if (!bank) {
                console.log(`Bank type ${item.type} not found for ${username}`);
                return null; 
            }

            const creaturelimit = (parseInt(item.price) * bank.profit) + parseInt(item.price);
            const limitperday = creaturelimit / bank.duration;

            return {
                plannumber: index + 1,
                planid: item._id,
                bankname: item.bankname,
                fruitcollection: item.fruitcollection,
                dailyclaim: item.dailyclaim,
                totalaccumulated: item.totalaccumulated,
                dailyaccumulated: item.dailyaccumulated,
                totalincome: item.totalincome,
                limittotal: creaturelimit,
                limitdaily: limitperday
            };
        }));

        const formattedData = finaldata.filter(item => item !== null).reduce((acc, item) => {
            acc[item.plannumber] = item;
            return acc;
        }, {});

        return res.json({ message: "success", totalplans, data: formattedData });
    } catch (err) {
        console.log(`There's a problem getting the inventory for ${username}. Error ${err}`);
        return res.json({ message: "bad-request", data: "There's a problem getting the inventory. Please contact customer support." });
    }
};


exports.senddaily = async (req, res) => {
    const { id, username } = req.user
    const { planid, pts } = req.body;

    // if (pts > 10) {
    //     return res.json({ message: "failed", data: 'Points cannot exceed 10' });
    // }

    try {
        const Plan = await Inventory.findOne({ _id: new mongoose.Types.ObjectId(planid), owner: new mongoose.Types.ObjectId(id)});
        if (!Plan) {
            return res.json({ message: "failed", data: 'Plan not found' });
        }

        Plan.fruitcollection = Number(Plan.fruitcollection) || 0;

        Plan.fruitcollection = Math.min(Plan.fruitcollection + Number(pts), 100);



            const bank = await Bank.findOne({ type: Plan.type });

            if (!bank) {
                console.log(`Bank type ${Plan.type} not found for ${username}`);
                return null; 
            }

            const creaturelimit = (parseInt(Plan.price) * bank.profit) + parseInt(Plan.price);
            const limitperday = creaturelimit / bank.duration;



            Plan.dailyaccumulated = (Plan.fruitcollection / 100) * limitperday;

        await Plan.save();

        return res.json({ message: "success" })
    } catch (error) {
        res.json({ message: "bad-request", data: "There's a problem with your account. Please contact support for more details." });
    }
};

exports.dailyClaim = async (req, res) => {

    const { id, username } = req.user
    const { planid } = req.body;

    try {
        const plan = await Inventory.findOne({ _id: new mongoose.Types.ObjectId(planid), owner: new mongoose.Types.ObjectId(id)});
        if (!plan) {
            return res.json({ message: "failed", data: 'Plan not found' });
        }

        if(plan.fruitcollection < 100) {
            return res.json({ message: "failed", data: 'Plan not ready for daily claim' });
        }

        if (plan.dailyclaim === 1) {
            return res.json({ message: "failed", data: 'Daily claim already made' });
        }

        const bank = await Bank.findOne({ type: plan.type })
        .then(data => data)
        .catch(err => {
            console.log(`Plan/Bank type ${plan.type} not found for ${username}. Error: ${err}`);
            return null;
        });

        const creaturelimit = (parseInt(plan.price) * bank.profit) + parseInt(plan.price);
        const limitperday = creaturelimit / bank.duration;
        plan.dailyclaim = 1;
        plan.totalaccumulated += limitperday;

        await plan.save();

        return res.json({ message: "success" });
    } catch (error) {
        console.error(error)
        res.json({ message: "bad-request", data: "There's a problem with your account. Please contact support for more details." });
    }
};