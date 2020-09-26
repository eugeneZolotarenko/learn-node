const path = require("path")

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const rootDir = require("./utils/path")
const sequelize = require("./utils/database")

const errorsController = require("./controllers/errors")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorsController.renderPageNotFound)

sequelize
  .sync()
  .then((result) => {
    app.listen(3000)
  })
  .catch((err) => console.log(err))
