const User = require("../models/user");
const { matchPassword } = require("../models/user");
async function handleSignUp(req, res) {
  try {
    const { fullName, email, password } = req.body;

    await User.create({
      fullName,
      email,
      password,
    });

    res.send("request received");
  } catch (error) {
    if (error.code === 11000) {
      return res.send("Email already exists");
    }

    return res.status(500).send("Something went wrong");
  }
}
async function handleSingIn(req, res) {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect email or password",
    });
  }
}
module.exports = {
  handleSignUp,
  handleSingIn,
};
