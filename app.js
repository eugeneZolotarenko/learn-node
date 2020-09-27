const path = require("path")

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const rootDir = require("./utils/path")
const sequelize = require("./utils/database")
const Product = require("./models/product")
const User = require("./models/user")

const errorsController = require("./controllers/errors")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorsController.renderPageNotFound)

Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" })
User.hasMany(Product)

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1)
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Eugene", email: "test@test.com" })
    }
    return user
  })
  .then((user) => {
    // console.log(user)
    app.listen(3000)
  })
  .catch((err) => console.log(err))
