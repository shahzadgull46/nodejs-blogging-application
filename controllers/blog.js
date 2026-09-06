const Blog = require("../models/blog");

async function handleCreateBlog(req, res) {
  try {
    const { title, body } = req.body;

    if (!title?.trim() || !body?.trim()) {
      return res.status(400).send("Title and body are required");
    }

    const user = req.user;

    if (!user) {
      return res.redirect("/signin");
    }

    const createdBy = req.user._id;
    const coverImageURL = `/images/${req.file?.filename}`;

    await Blog.create({
      title,
      body,
      coverImageURL,
      createdBy,
    });

    res.redirect("/");
  } catch (error) {
    console.log("Blog creation failed:", error);
    return res.status(500).send("Something went wrong");
  }
}
module.exports = {
  handleCreateBlog,
};
