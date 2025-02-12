const { playerwallets } = require("../controllers/wallet")
const { protectplayer } = require("../middleware/middleware")

const router = require("express").Router()

router
 .get("/playerwallets", protectplayer, playerwallets)



module.exports = router