const router = require("express").Router()
const { getuserdetails, updateuserprofile, getreferrallink, changepassworduser, changepassworduserforadmin, getuserdetailssuperadmin, getuserinformation } = require("../controllers/user")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

router
    .post("/changepassworduser", protectplayer, changepassworduser)
    .post("/updateuserprofile", protectplayer, updateuserprofile)
    .get("/getuserinformation", protectplayer, getuserinformation)

    // .get("/getplayerlist", protectsuperadmin, getplayerlist)
    // .get("/searchplayerlist", protectsuperadmin, searchplayerlist)
    // .get("/getplayercount", protectsuperadmin, getplayercount)
    // .post("/multiplebanusers", protectsuperadmin, multiplebanusers)
    // .post("/banunbanuser", protectsuperadmin, banunbanuser)

module.exports = router;
