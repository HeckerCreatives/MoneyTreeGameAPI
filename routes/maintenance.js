const router = require("express").Router()
const { getmaintenance, changemaintenance, geteventmainte } = require("../controllers/maintenance")
const { protectsuperadmin, protectplayer } = require("../middleware/middleware")

router
    .get("/geteventmainte", protectplayer, geteventmainte)
    .post("/changemaintenance", protectsuperadmin, changemaintenance)

module.exports = router;
