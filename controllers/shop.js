const Product = require("../models/product")
const Order = require("../models/order")

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    await res.render("shop/product-list", {
      products,
      pageTitle: "All products",
      path: "/products",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getProduct = async (req, res) => {
  try {
    const prodId = await req.params.productId
    const product = await Product.findById(prodId)
    await res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find()
    await res.render("shop/index", {
      products,
      pageTitle: "Shop",
      path: "/",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate()
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart.items,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body
    // console.log(productId)
    await req.user.deleteFromCart(productId)
    await res.redirect("/cart")
  } catch (err) {
    console.log(err)
  }
}

exports.postCart = async (req, res) => {
  try {
    const { productId } = req.body

    const product = await Product.findById(productId)
    await req.user.addToCart(product)
    await res.redirect("/cart")
  } catch (err) {
    console.log(err)
  }
}

exports.postOrder = async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate()
    const products = await user.cart.items.map((i) => {
      return {
        quantity: i.quantity,
        product: i.productId,
      }
    })
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products,
    })
    await order.save()
    await res.redirect("/orders")
  } catch (err) {
    console.log(err)
  }
}

// exports.getOrders = async (req, res, next) => {
//   try {
//     const orders = await req.user.getOrders()
//     await res.render("shop/orders", {
//       path: "/orders",
//       pageTitle: "Your Orders",
//       orders,
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }
