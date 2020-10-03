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
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      price,
      description,
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect("/")
  }
  const { productId } = req.params
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0]
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
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      })
    })
    .catch((err) => console.log(err))
}
