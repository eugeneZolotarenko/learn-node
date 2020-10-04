const Product = require("../models/product")

const mongodb = require("mongodb")

exports.renderAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  })
}

exports.postNewProduct = (req, res) => {
  const { title, price, imageUrl, description } = req.body
  new Product(title, price, imageUrl, description)
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
    })
  } catch (error) {
    console.log(error)
  }
}

exports.postEditProduct = async (req, res) => {
  const { title, imageUrl, price, description, id } = req.body
  try {
    await new Product(
      title,
      price,
      imageUrl,
      description,
      new mongodb.ObjectId(id)
    ).save()
    await res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
  // .then((product) => {
  //   product.title = title
  //   product.price = price
  //   product.description = description
  //   product.imageUrl = imageUrl
  //   return product.save()
  // })
  // .then(() => res.redirect("/admin/products"))
  // .catch((err) => console.log(err))
}

// exports.postDeleteProduct = (req, res) => {
//   const { id } = req.body
//   Product.findByPk(id)
//     .then((product) => product.destroy())
//     .then(() => res.redirect("/admin/products"))
//     .catch((err) => console.log(err))
// }

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll()
    await res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    })
  } catch (error) {
    console.log(error)
  }
}
