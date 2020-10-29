const Product = require("../models/product")

exports.renderAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  })
}

exports.postNewProduct = (req, res) => {
  const { title, price, imageUrl, description } = req.body
  const userId = req.user
  new Product({ title, price, imageUrl, description, userId })
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err))
}

exports.getEditProduct = async (req, res) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect("/")
  }
  const { productId } = req.params
  try {
    const product = await Product.findById(productId)
    if (!product) {
      return await res.redirect("/")
    }
    await res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
      isAuthenticated: req.isLoggedIn,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.postEditProduct = async (req, res) => {
  const { title, imageUrl, price, description, id } = req.body
  try {
    const product = await Product.findById(id)
    product.title = title
    product.imageUrl = imageUrl
    product.price = price
    product.description = description
    await product.save()
    await res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.postDeleteProduct = async (req, res) => {
  try {
    const { id } = req.body
    await Product.findByIdAndRemove(id)
    await res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    await res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: req.isLoggedIn,
    })
  } catch (error) {
    console.log(error)
  }
}
