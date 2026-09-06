const mongoose = require("mongoose");

const crypto = require("crypto");

const {createTokenForUser} = require("../services/authentication")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      // required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) return null;
  // next();
const salt = crypto.randomBytes(16).toString("hex")
this.salt = salt;

this.password = crypto
.createHmac("sha256",this.salt)
.update(this.password)
.digest("hex")

  // next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function(email,password){
const user = await User.findOne({email})
if(!user) throw new Error("User not found")
    const hasedPassword = crypto
    .createHmac("sha256",user.salt)
    .update(password)
    .digest("hex")
    if (hasedPassword!==user.password) {
        throw new Error ("Incorrect Password")
    }
    const token = createTokenForUser(user)
    user.password = undefined
    user.salt = undefined
    return token;
}
const User = mongoose.model("user", userSchema);

module.exports = User;
