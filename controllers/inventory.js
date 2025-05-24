const { default: mongoose } = require("mongoose")
const Inventory = require("../models/Inventory");
const Bank = require("../models/Bank");
const Weather = require("../models/Weather");
const Dailyclaim = require("../models/Dailyclaim");
exports.getgameinventory = async (req, res) => {
    const { id, username } = req.user;

    try {
        const data = await Inventory.find({ owner: new mongoose.Types.ObjectId(id) })
            .sort({ rank: -1 });

        if (!data || data.length === 0) {
            return res.json({ message: "failed", data: "No inventory found" });
        }

        const weather = await Weather.findOne()
            .then(data => data)
            .catch(err => {
                console.log(`Weather not found for ${username}. Error: ${err}`);
                return null;
            });

            

        const totalplans = data.length;

        const weatherdata = {
            weather: weather.name,
            sound: weather.sound
        }

        const finaldata = await Promise.all(data.map(async (item, index) => {

            const creaturelimit = (parseInt(item.price) * item.profit) + parseInt(item.price);
            const limitperday = creaturelimit / item.duration;

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

        return res.json({ message: "success", weatherdata, totalplans, data: formattedData });
    } catch (err) {
        console.log(`There's a problem getting the inventory for ${username}. Error ${err}`);
        return res.json({ message: "bad-request", data: "There's a problem getting the inventory. Please contact customer support." });
    }
};


exports.senddaily = async (req, res) => {
    const { id, username } = req.user
    const { planid, pts } = req.body;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const Plan = await Inventory.findOne(
            { _id: new mongoose.Types.ObjectId(planid), owner: new mongoose.Types.ObjectId(id)},
            null,
            { session }
        );
        if (!Plan) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Plan not found' });
        }

        if (Plan.totalaccumulated >= Plan.totalincome) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Plan limit reached' });
        }

        Plan.fruitcollection = Number(Plan.fruitcollection) || 0;
        Plan.fruitcollection = Math.min(Plan.fruitcollection + Number(pts), 100);

        const bank = await Bank.findOne({ type: Plan.type }, null, { session });

        if (!bank) {
            await session.abortTransaction();
            console.log(`Bank type ${Plan.type} not found for ${username}`);
            return res.json({ message: "failed", data: 'Bank type not found' }); 
        }

        const creaturelimit = (parseInt(Plan.price) * bank.profit) + parseInt(Plan.price);
        const limitperday = creaturelimit / bank.duration;

        Plan.dailyaccumulated = (Plan.fruitcollection / 100) * limitperday;

        await Plan.save({ session });
        await session.commitTransaction();

        return res.json({ message: "success" })
    } catch (error) {
        await session.abortTransaction();
        res.json({ message: "bad-request", data: "There's a problem with your account. Please contact support for more details." });
    } finally {
        session.endSession();
    }
};

exports.dailyClaim = async (req, res) => {
    const { id, username } = req.user
    const { planid } = req.body;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const plan = await Inventory.findOne(
            { _id: new mongoose.Types.ObjectId(planid), owner: new mongoose.Types.ObjectId(id)},
            null,
            { session }
        );
        if (!plan) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Plan not found' });
        }

        if(plan.totalaccumulated >= plan.totalincome) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Plan limit reached' });
        }

        if(plan.fruitcollection < 100) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Plan not ready for daily claim' });
        }

        if (plan.dailyclaim === 1) {
            await session.abortTransaction();
            return res.json({ message: "failed", data: 'Daily claim already made' });
        }

        const bank = await Bank.findOne({ type: plan.type }, null, { session })
            .then(data => data)
            .catch(err => {
                console.log(`Plan/Bank type ${plan.type} not found for ${username}. Error: ${err}`);
                return null;
            });

        const creaturelimit = (parseInt(plan.price) * bank.profit) + parseInt(plan.price);
        const limitperday = creaturelimit / bank.duration;
        plan.dailyclaim = 1;
        plan.totalaccumulated += limitperday;

        await Dailyclaim.create([{
            owner: new mongoose.Types.ObjectId(id),
            inventory: new mongoose.Types.ObjectId(planid),
            amount: limitperday
        }], { session });

        await plan.save({ session });
        await session.commitTransaction();

        return res.json({ message: "success" });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.json({ message: "bad-request", data: "There's a problem with your account. Please contact support for more details." });
    } finally {
        session.endSession();
    }
};