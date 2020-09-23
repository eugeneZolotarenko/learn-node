const Product = require("../models/product")

exports.renderAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  })
}

exports.postNewProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product(null, title, imageUrl, price, description)
  product.save()
  res.redirect("/")
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  const { productId } = req.params
  if (!editMode) {
    return res.redirect("/")
  }
  Product.fetchOneById(productId, (product) => {
    if (!product) {
      return res.redirect("/")
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    })
  })
}

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body
  const product = new Product(id, title, imageUrl, price, description)
  product.save()
  res.redirect("/")
}

exports.postDeleteProduct = (req, res) => {
  const { id } = req.body
  Product.delete(id)
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
