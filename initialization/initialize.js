const StaffUser = require("../models/Staffusers")
const { default: mongoose } = require("mongoose")
const Users = require("../models/Users")
const Userdetails = require("../models/Userdetails")
const Userwallets = require("../models/Userwallets")
const StaffUserwallets = require("../models/Staffuserwallets")
const Maintenance = require("../models/Maintenance")
const Leaderboard = require("../models/Leaderboard")
const Sociallinks = require("../models/Sociallinks")
const Bank = require("../models/Bank")


exports.initialize = async () => {

    const csadmin = await Users.findOne({username: "moneytree"})
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting cs user data ${err}`)
        return
    })

    if (!csadmin){
        const player = await Users.create({_id: new mongoose.Types.ObjectId(process.env.MONEYTREE_ID), username: "moneytree", password: "OdAf2NI3Si1IDJ", gametoken: "", webtoken: "", bandate: "none", banreason: "", status: "active"})
        
        
        await Userdetails.create({owner: new mongoose.Types.ObjectId(player._id), phonenumber: "", fistname: "", lastname: "", address: "", city: "", country: "", postalcode: "", profilepicture: ""})
        .catch(async err => {

            await Users.findOneAndDelete({_id: new mongoose.Types.ObjectId(player._id)})

            console.log(`Server Initialization Failed, Error: ${err}`);

            return
        })
    
        const wallets = ["fiatbalance", "gamebalance", "commissionbalance"]

        wallets.forEach(async (data) => {
            await Userwallets.create({owner: new mongoose.Types.ObjectId(player._id), type: data, amount: 0})
            .catch(async err => {

                await Users.findOneAndDelete({_id: new mongoose.Types.ObjectId(player._id)})


                await Userdetails.findOneAndDelete({_id: new mongoose.Types.ObjectId(player._id)})

                console.log(`Server Initialization Failed, Error: ${err}`);
    
                return
            })
        })

        console.log("cs user created")

        
    }

    const admin = await StaffUser.find({ auth: "superadmin"})
    .then(data => data)
    .catch(err => {
        console.log(`Error finding the admin data: ${err}`)
        return
    })

    if(admin.length <= 0 ){
        await StaffUser.create({ _id: new mongoose.Types.ObjectId(process.env.MONEYTREE_ID), username: "moneytreesuperadmin", password: "OdAf2NI3Si1IDJ", webtoken: "", status: "active", auth: "superadmin"})
        .catch(err => {
            console.log(`Error saving admin data: ${err}`)
            return
        }) 

        await StaffUserwallets.create({owner: new mongoose.Types.ObjectId(process.env.MONEYTREE_ID), type: "adminfee", amount: 0})
        .catch(async err => {

            await StaffUser.findOneAndDelete({_id: new mongoose.Types.ObjectId(process.env.MONEYTREE_ID)})

            console.log(`There's a problem creating admin fee wallet Error: ${err}`)

            return res.status(400).json({ message: "bad-request", data: "There's a problem registering your account. Please try again." })
        })

    }

    const maintenancelist = await Maintenance.find()
    .then(data => data)
    .catch(err => {
        console.log("there's a problem getting maintenance list")

        return
    })

    if (maintenancelist.length <= 0){
        const maintenancelistdata = ["fightgame", "eventgame", "fullgame", "payout"]

        maintenancelistdata.forEach(async maintenancedata => {
            await Maintenance.create({type: maintenancedata, value: "0"})
            .catch(err => {
                console.log(`there's a problem creating maintenance list ${err}`)

                return
            })
        })
        console.log("Maintenance initalized")
    }


    const banks = await Bank.find()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting bank data ${err}`)
        return
    })

    if(banks.length <= 0){
        const bank = [
            {
            type: "piggy_bank",
            name: "Piggy Bank",
            min: 500,
            max: 5000,
            profit: 0.2,
            duration: 7,
            b1t1: "0"
            },
            {
            type: "money_vault",
            name: "Money Vault", 
            min: 1000,
            max: 10000,
            profit: 0.50,
            duration: 14,
            b1t1: "0"
            },
            {
            type: "treasure_chest",
            name: "Treasure Chest",
            min: 5000,
            max: 50000,
            profit: 1.2,
            duration: 28,
            b1t1: "0"
            },
        ];

        await Bank.bulkWrite(
            bank.map((data) => ({
                insertOne: { document: data },
            }))
        )
        .then(data => data)
        .catch(err => {
            console.log(`There's a problem creating creature data ${err}`)
            return
        })
    }

    // initialize leaderboard for existing users

    const users = await Users.find()
    .then(data => data)
    .catch(err => {
        console.log(`There's a problem getting users data ${err}`)
        return
    })

    if(users.length > 0){
        users.forEach(async user => {
            const hasleaderboard = await Leaderboard.findOne({owner: new mongoose.Types.ObjectId(user._id)})

            if(!hasleaderboard){
            await Leaderboard.create({owner: new mongoose.Types.ObjectId(user._id), amount: 0})
            .catch(err => {
                console.log(`There's a problem creating leaderboard data ${err}`)
                return
            })
            console.log(`Leaderboard for ${user.username} created`)
        }

        })
    }

    const usersWithoutGameId = await Users.find({ gameid: { $exists: false } });

        for (const user of usersWithoutGameId) {
            let unique = false;
            while (!unique) {
                const gameid = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate a 10-digit number
                const existingUser = await Users.findOne({ gameid });
                if (!existingUser) {
                    user.gameid = gameid;
                    unique = true;
                }
            }
            await user.save();
            console.log(`Game ID ${user.gameid} assigned to user ${user.username}`);
        }

        console.log("Game ID initialization complete.");

    const sociallinks = await Sociallinks.find()
    .then(data => data)
    .catch(err => {
        console.log(`Error finding Social Links data: ${err}`)
    })


    if(sociallinks.length <= 0){
        const socialinksdata = ["facebook", "discord", "telegram", "tiktok"]

        const socialinksbulkwrite = socialinksdata.map(titles => ({
            insertOne: {
                document: { title: titles, link: ""}
            }
        }))

        await Sociallinks.bulkWrite(socialinksbulkwrite)
        .catch(err => {
            console.log(`Error creating social links data: ${err}`)
            return
        }) 
    }


    console.log("SERVER DATA INITIALIZED")
}