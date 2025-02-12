const { default: mongoose } = require("mongoose")
const Userdetails = require("../models/Userdetails")
const Users = require("../models/Users")
const fs = require("fs")
const Payin = require("../models/Payin")
const bcrypt = require('bcrypt');
const Leaderboard = require("../models/Leaderboard")

exports.getreferrallink = async (req, res) => {
    const {id} = req.user

    return res.json({message: "success", data: id})
}

exports.getuserdetails = async (req, res) => {
    const {id, username} = req.user

    const details = await Userdetails.findOne({owner: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting user details for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your user details. Please contact customer support." })
    })

    if (!details){
        return res.json({ message: "bad-request", data: "There's a problem with your account! Please contact customer support." })
    }

    const data = {
        username: username,
        phonenumber: details.phonenumber,
        fistname: details.firstname,
        lastname: details.lastname,
        address: details.address,
        city: details.city,
        country: details.country,
        postalcode: details.postalcode,
        paymentmethod: details.paymentmethod,
        accountnumber: details.accountnumber,
        profilepicture: details.profilepicture
    }

    return res.json({message: "success", data: data})
}

exports.getuserdetailssuperadmin = async (req, res) => {
    const {id, username} = req.user
    const {userid} = req.query

    const details = await Users.findOne({_id: new mongoose.Types.ObjectId(userid)})
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting user details for ${userid} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your user details. Please contact customer support." })
    })

    if (!details){
        return res.json({ message: "failed", data: "No user found! Please select a valid user." })
    }

    const data = {
        username: details.username,
        status: details.status
    }

    return res.json({message: "success", data: data})
}

exports.changepassworduser = async (req, res) => {
    const {id, username} = req.user
    const {password} = req.body
    
    if (password == ""){
        return res.json({ message: "failed", data: "Please complete the form first before saving!" })
    }

    const hashPassword = bcrypt.hashSync(password, 10)

    await Users.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)}, {password: hashPassword})
    .catch(err => {

        console.log(`There's a problem changing password user for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem changing your password. Please contact customer support." })
    })

    return res.json({message: "success"})
}

exports.changepassworduserforadmin = async (req, res) => {
    const {id, username} = req.user
    const {playerid, password} = req.body
    
    if (password == ""){
        return res.json({ message: "failed", data: "Please complete the form first before saving!" })
    }

    const hashPassword = bcrypt.hashSync(password, 10)

    await Users.findOneAndUpdate({_id: new mongoose.Types.ObjectId(playerid)}, {password: hashPassword})
    .catch(err => {

        console.log(`There's a problem changing password user for ${username}, player: ${playerid} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem changing password. Please contact customer support." })
    })

    return res.json({message: "success"})
}

exports.updateuserprofile = async (req, res) => {
    const {id, username} = req.user
    const {phonenumber, firstname, lastname, address, city, country, postalcode, paymentmethod, accountnumber} = req.body

    if (firstname == "" || lastname == "" || address == "" || city == "" || country == "" || postalcode == "" || paymentmethod == "" || accountnumber == ""){
        return res.json({ message: "bad-request", data: "Please complete the form before updating!." })
    }

    await Userdetails.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id)}, {firstname: firstname, lastname: lastname, address: address, city: city, country: country, postalcode: postalcode, paymentmethod: paymentmethod, accountnumber: accountnumber, phonenumber: phonenumber})
    .catch(err => {

        console.log(`There's a problem saving user details for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem updating your user details. Please contact customer support." })
    })

    return res.json({message: "success"})
}


exports.getuserinformation = async (req, res) => {
    const {id, username} = req.user

    const user = await Users.findOne({_id: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting user information for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your user information. Please contact customer support." })
    })

    if (!user){
        return res.json({ message: "bad-request", data: "There's a problem with your account! Please contact customer support." })
    }

    const leaderboardrank = await Leaderboard.findOne({ owner: new mongoose.Types.ObjectId(id) })
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting leaderboard for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your leaderboard. Please contact customer support." })
    })

    const userranking = await Leaderboard.countDocuments({ amount: { $gt: leaderboardrank.amount } })   

    const data = {
        username: user.username,
        status: user.status,
        userrank: userranking + 1,
        userpoints: leaderboardrank.amount
    }

    return res.json({message: "success", data: data})
}