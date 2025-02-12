const { default: mongoose } = require("mongoose")
const Userwallets = require("../models/Userwallets")

exports.playerwallets = async (req, res) => {
    const { id } = req.user

    const wallets = await Userwallets.find({owner: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => {

        console.log(`Failed to get dashboard wallet data for ${data.owner}, error: ${err}`)

        return res.json({ message: 'failed', data: `There's a problem with your account. Please contact customer support for more details` })
    })

    const data = {}

    wallets.forEach(datawallet => {
        const {type, amount} = datawallet

        data[type] = amount
    })

    return res.json({message: "success", data: data})
}