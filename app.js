const path = require("path")

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

const rootDir = require("./utils/path")

const errorsController = require("./controllers/errors")
const User = require("./models/user")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")
const authRoutes = require("./routes/auth")

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oygt6.mongodb.net/${process.env.DB_NAME}?w=majority`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
})

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
)

app.use(async (req, res, next) => {
  try {
    if (await User.findById(req.session.user)) {
      const user = await User.findById(req.session.user._id)
      req.user = user
    }
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorsController.renderPageNotFound)

mongoose
  .connect(MONGODB_URI)
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
