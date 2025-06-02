const mongoose = require("mongoose");
const { Schema } = mongoose;

const IngameSchema = new Schema(
    {
        type: {
            type: String,
            index: true
        },
        value: {
            type: Schema.Types.Mixed 
        },
    },
    {
        timestamps: true
    }
);

const Ingame = mongoose.model("Ingame", IngameSchema);
module.exports = Ingame;
