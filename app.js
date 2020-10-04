const path = require("path")

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const rootDir = require("./utils/path")

const errorsController = require("./controllers/errors")
const mongoConnect = require("./utils/database").mongoConnect

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user
  //     next()
  //   })
  //   .catch((err) => console.log(err))
  next()
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorsController.renderPageNotFound)

mongoConnect((client) => {
  app.listen(3000)
})
