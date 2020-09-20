const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")

const rootDir = require("./utils/path")
const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")
const errorsController = require("./controllers/errors")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, "public")))

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorsController.renderPageNotFound)

app.listen(3000)
