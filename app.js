const path = require("path")

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const rootDir = require("./utils/path")

const errorsController = require("./controllers/errors")
const User = require("./models/user")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5f8ab8912a154856c46d278f")
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorsController.renderPageNotFound)

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oygt6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Eugene",
          email: "test@test.com",
          cart: {
            items: [],
          },
        })
        newUser.save()
      }
    })
    app.listen(3000)
  })
  .catch((err) => console.log(err))
