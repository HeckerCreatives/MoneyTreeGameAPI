const router = require("express").Router()
const { authlogin, logout, register, registerstaffs, getreferralusername, automaticlogin, gameidlogin } = require("../controllers/auth")
const { protectsuperadmin, protectusers } = require("../middleware/middleware")

router
    .get("/login", authlogin)
    .get("/gameidlogin", gameidlogin)
    .get("/logout", logout)
    .post("/register", register)
    .get("/getreferralusername", getreferralusername)
    .get("/automaticlogin", protectusers, automaticlogin)
    .post("/registerstaffs", protectsuperadmin, registerstaffs)


module.exports = router;
