const User = require("../models/user")
const bcrypt = require("bcryptjs")

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
    const { email, password } = req.body
    req.session.isLoggedIn = true
    const user = await User.findOne({ email })
    if (!user) {
      return await res.redirect("/login")
    }
    const doMatch = await bcrypt.compare(password, user.password)
    if (doMatch) {
      req.session.user = user
      await req.session.save()
      await res.redirect("/")
    } else {
      await res.redirect("/login")
    }
  } catch (err) {
    console.log(err)
  }
}

exports.getSignup = async (req, res, next) => {
  try {
    await res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body
    const userDoc = await User.findOne({ email })
    if (userDoc) {
      return await res.redirect("/signup")
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    })
    await user.save()
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
