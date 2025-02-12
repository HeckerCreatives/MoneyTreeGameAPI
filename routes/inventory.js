const { getgameinventory, senddaily, dailyClaim } = require("../controllers/inventory")
const { protectplayer } = require("../middleware/middleware")

const router = require("express").Router()


router 
.get("/getgameinventory", protectplayer, getgameinventory)
.post("/senddaily", protectplayer, senddaily)
.post("/dailyclaim", protectplayer, dailyClaim)

module.exports = router