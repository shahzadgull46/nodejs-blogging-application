require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

const { userRouter } = require("./routes/user");

const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const Blog = require("./models/blog");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", userRouter);

// connection
const { connectMongoDB } = require("./connection/connection");

connectMongoDB()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection failed:", error));
//Routes
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).populate("createdBy");

    res.render("home", {
      blogs: allBlogs,
    });
  } catch (error) {
    console.log("Failed to fetch blogs:", error);
    return res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
