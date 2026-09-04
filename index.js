const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;



const { userRouter} = require("./routes/user")


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/",userRouter)


// connection
const {connectMongoDB} = require("./connection/connection")
connectMongoDB()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection failed:", error));
//Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
