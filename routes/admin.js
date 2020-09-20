const express = require("express")

const adminController = require("../controllers/admin")

const router = express.Router()

router.get("/add-product", adminController.renderAddProductPage)

router.get("/products", adminController.getProducts)

router.post("/add-product", adminController.postNewProduct)

router.post("/edit-product/:productId", adminController.getEditProduct)

module.exports = router
