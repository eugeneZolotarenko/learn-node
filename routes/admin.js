const path = require("path")

const express = require("express")

const productsController = require("../controllers/products")

const router = express.Router()

router.get("/add-product", productsController.renderAddProductPage)

router.post("/add-product", productsController.postNewProduct)

module.exports = router
