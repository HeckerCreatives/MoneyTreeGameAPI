const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const GlobalPasswordSchema = new mongoose.Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staffusers", // Refers to the Staffusers collection
        index: true,
      },
      secretkey: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: true, 
      },
    },
    {
      timestamps: true, 
    }
  );
  
  GlobalPasswordSchema.virtual("usageDetails", {
    refPath: "usage.userType", 
    localField: "usage.user",
    foreignField: "_id",
  });

GlobalPasswordSchema.pre("save", async function (next) {
    if (!this.isModified){
        next();
    }

    this.secretkey = await bcrypt.hashSync(this.secretkey, 10)
})

GlobalPasswordSchema.methods.matchPassword = async function(secretkey){
    return await bcrypt.compare(secretkey, this.secretkey)
}

const GlobalPassword = mongoose.model("GlobalPassword", GlobalPasswordSchema)

module.exports = GlobalPassword