const routers = app => {
    console.log("Routers are all available");

    app.use("/auth", require("./auth"))
    app.use("/inventory", require("./inventory"))
    app.use("/leaderboard", require("./leaderboard"))
    app.use("/maintenance", require("./maintenance"))
    app.use("/user", require("./user"))
    app.use("/wallet", require("./wallet"))
}

module.exports = routers