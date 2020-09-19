const path = require("path")

const express = require("express")

const rootDir = require("../utils/path")
const adminData = require("./admin")

const router = express.Router()

router.get("/", (req, res) => {
  const products = adminData.products
  res.render("shop", {
    products,
    pageTitle: "Shop",
    path: "/",
    activeShop: true,
    productCSS: true,
  })
})

module.exports = router
