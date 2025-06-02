const { gettierentry, getplayerentrylimit, geteventtimelimit } = require("../controllers/event")
const { protectplayer } = require("../middleware/middleware")

const router = require("express").Router()


router 
.get("/gettierentry", protectplayer, gettierentry)
.get("/getplayerentrylimit", protectplayer, getplayerentrylimit)
.get("/geteventtimelimit", protectplayer, geteventtimelimit)

module.exports = router