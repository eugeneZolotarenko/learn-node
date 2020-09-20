const Product = require("../models/product")

exports.renderAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
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

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect("/")
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: editMode,
  })
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
