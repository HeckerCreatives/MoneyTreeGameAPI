const Eventtimelimit = require("../models/Eventtimelimit")
const Evententrylimit = require("../models/Evententrylimit")
const Eventtierentry = require("../models/Eventtierentry")
const { default: mongoose } = require("mongoose")

exports.gettierentry = async (req, res) => {
  const {id} = req.user

  const entries = await Eventtierentry.find()

  const entrydata = {
    "Free": false,
    "Nest Stash": false,
    "Wealth Jar": false,
    "Piggy Bank": false
  }


  entries.forEach(tempdata => {
    const {type, status} = tempdata

    entrydata[type] = status
  })

  return res.json({ message: "success", 
    data: entrydata
  })
}

exports.getplayerentrylimit = async (req, res) => {
  const {id} = req.user

  const limit = await Evententrylimit.find()

  if (limit.length <= 0){
    return res.json({message: "success", data: { limit: 0 }})
  }

    return res.json({message: "success", data: { limit: limit[0].limit }})
}

exports.geteventtimelimit = async (req, res) => {
  const {id} = req.user

  const temptime = await Eventtimelimit.find()

  if (temptime.length <= 0){
    return res.json({message: "success", 
      data: {
        minutes: 0,
        seconds: 0
      }
    })
  }

  return res.json({message: "success", 
    data: {
      minutes: temptime[0].minutes,
      seconds: temptime[0].seconds
    }
  })
}