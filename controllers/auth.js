const User = require("../models/user")

exports.getLogin = async (req, res, next) => {
  try {
    await res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    req.session.isLoggedIn = true
    const user = await User.findById("5f8ab8912a154856c46d278f")
    req.session.user = user
    await req.session.save()
    await res.redirect("/")
  } catch (err) {
    console.log(err)
  }
}

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect("/")
  })
}
