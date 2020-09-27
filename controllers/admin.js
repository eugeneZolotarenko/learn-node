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
  Product.create({ title, price, imageUrl, price, description })
    .then(() => res.redirect("/admin/products"))
    .catch((res) => console.error(res))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  const { productId } = req.params
  if (!editMode) {
    return res.redirect("/")
  }
  Product.findByPk(productId)
    .then((product) => {
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
    .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body
  Product.findByPk(id)
    .then((product) => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
  const { id } = req.body
  Product.findByPk(id)
    .then((product) => product.destroy())
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    })
    .catch((err) => console.log(err))
}
