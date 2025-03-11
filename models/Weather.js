const { default: mongoose } = require("mongoose");


const WeatherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        sound: {
            type: String,
            required: true
        }
    }, 
    {
        timestamps: true
    }
)

const Weather = mongoose.model("Weather", WeatherSchema)
module.exports = Weather