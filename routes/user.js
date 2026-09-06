const express = require("express");

const userRouter = express.Router();
const multer = require("multer");

const { handleSignUp, handleSingIn } = require("../controllers/user");
const { handleCreateBlog } = require("../controllers/blog");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

userRouter.get("/signin", (req, res) => {
  res.render("signin");
});
userRouter.post("/signin", handleSingIn);

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

userRouter.get("/signup", (req, res) => {
  res.render("signup");
});
userRouter.post("/signup", handleSignUp);

userRouter.get("/add-blog", (req, res) => {
  if (!req.user) {
    return res.redirect("/signin");
  }

  res.render("addBlog");
});
userRouter.post(
  "/add-blog",
  (req, res, next) => {
    if (!req.user) {
      return res.redirect("/signin");
    }

    next();
  },
  upload.single("coverImage"),
  handleCreateBlog,
);
userRouter.get("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate("createdBy");
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy",
    );

    res.render("blog", { blog: blog, comments: comments });
  } catch (error) {
    return res.status(404).send("Blog not found");
  }
});

userRouter.post("/blog/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.redirect("/signin");
  }
  const { content } = req.body;
  if (!content?.trim()) {
  return res.status(400).send("Comment cannot be empty");
}
  const blogId = req.params.blogId;
  const createdBy = req.user._id;
  await Comment.create({
    content,
    blogId,
    createdBy,
  });
  res.redirect(`/blog/${blogId}`);
});

module.exports = {
  userRouter,
};
