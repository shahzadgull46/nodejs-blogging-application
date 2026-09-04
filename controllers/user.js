const User = require("../models/user");
const {matchPassword} = require("../models/user")
async function handleSignUp(req, res) {
  console.log(req.body);
  const { fullName, email, password } = req.body;
  const user = await User.create({
    fullName,
    email,
    password,
  });

  res.send("request received");
}
async function handleSingIn(req, res) {
  const { email, password } = req.body;
  const user = await User.matchPassword(email, password);
  console.log(user);

  res.send("Sign in successful");
}
module.exports = {
  handleSignUp,
  handleSingIn,
};
