const Maintenance = require("../models/Maintenance")

exports.checkmaintenance = async (type) => {

    const mainte = await Maintenance.findOne({type: type})
    .then(data => data)
    .catch(err => {

        console.log(`There's a problem getting maintenance data for ${username} Error: ${err}`)

        return "failed"
    })

    if (mainte.value == "0"){
        return "maintenance"
    }
    else{
        return "success"
    }
}