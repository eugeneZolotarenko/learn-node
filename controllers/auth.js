const User = require("../models/user")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
)

exports.getLogin = async (req, res, next) => {
  try {
    let message = req.flash("error")
    if (message.length > 0) {
      message = message[0]
    } else {
      message = null
    }
    console.log(req.flash("error"))
    await res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMessage: message,
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
      req.flash("error", "Invalid email or passwords")
      return await res.redirect("/login")
    }
    const doMatch = await bcrypt.compare(password, user.password)
    if (doMatch) {
      req.session.user = user
      await req.session.save()
      await res.redirect("/")
    } else {
      req.flash("error", "Invalid email or passwords")
      await res.redirect("/login")
    }
  } catch (err) {
    console.log(err)
  }
}

exports.getSignup = async (req, res, next) => {
  try {
    let message = req.flash("error")
    if (message.length > 0) {
      message = message[0]
    } else {
      message = null
    }
    await res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: message,
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
      req.flash("error", "Email already exists")
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
    await transporter.sendMail({
      to: email,
      from: "zolotarenko.yevheniy1998@gmail.com",
      subject: "Sugnup succeeded!",
      html: "<h1>You successfully signed up!</h1>",
    })
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
