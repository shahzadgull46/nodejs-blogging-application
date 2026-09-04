const mongoose = require("mongoose")

require("dotenv").config()


async function connectMongoDB() {
   await mongoose.connect(process.env.MONGODB_URI)
   console.log("Database name:", mongoose.connection.name);
}

module.exports={
    connectMongoDB,
} 