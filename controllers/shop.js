const Product = require("../models/product")

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll()
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
    const products = await Product.fetchAll()
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
    const cart = await req.user.getCart()
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cart,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body
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
    // const cart = await req.user.getCart()
    // const products = await cart.getProducts()
    await req.user.addOrder()
    // await order.addProducts(
    //   products.map((product) => {
    //     product.orderItem = {
    //       quantity: product.cartItem.quantity,
    //     }
    //     return product
    //   })
    // )
    // await cart.setProducts(null)
    await res.redirect("/orders")
  } catch (err) {
    console.log(err)
  }
}

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders()
    await res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    })
  } catch (err) {
    console.log(err)
  }
}

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/Checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   })
// }
