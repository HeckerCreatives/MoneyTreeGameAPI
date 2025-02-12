const Maintenance = require("../models/Maintenance")

exports.changemaintenance = async (req, res) => {
    const {id, username} = req.user
    const {type, value} = req.body

    await Maintenance.findOneAndUpdate({type: type}, {value: value})
    .catch(err => {

        console.log(`There's a problem updating maintenance data for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your user details. Please contact customer support." })
    })

    return res.json({message: "success"})
}

exports.geteventmainte = async (req, res) => {
    const {id, username} = req.user
    const {maintenancetype} = req.query

    const mainte = await Maintenance.findOne({type: maintenancetype})
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting maintenance data for ${username} Error: ${err}`)

        return res.json({ message: "bad-request", data: "There's a problem getting your user details. Please contact customer support." })
    })

    const data = {
        type: mainte.type,
        value: mainte.value
    }

    return res.json({message: "success", data: data})
}