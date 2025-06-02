const mongoose = require("mongoose")

const GlobalPassUsageSchema = new mongoose.Schema(
    {
        passid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
          },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        userType: {
            type: String,
            enum: ["Users", "Staffusers"],
            required: true,
          },
    },
    {
        timestamps: true,
    }
)


const Globalpassusage = mongoose.model("Globalpassusage", GlobalPassUsageSchema)

module.exports = Globalpassusage