const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        value: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
module.exports = Maintenance