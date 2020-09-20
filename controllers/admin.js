const Product = require("../models/product")

exports.renderAddProductPage = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  })
}

exports.postNewProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product(title, imageUrl, price, description)
  product.save()
  res.redirect("/")
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    })
  })
}
