const Product = require("../models/product")
const Cart = require("../models/cart")

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products,
      pageTitle: "All products",
      path: "/products",
    })
  })
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.fetchOneById(prodId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products,
      pageTitle: "Shop",
      path: "/",
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find(
          (cartProd) => cartProd.id === product.id
        )
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty })
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      })
    })
  })
}

exports.deleteCartItem = (req, res) => {
  const prodId = req.body.productId
  Product.fetchOneById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect("/cart")
  })
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  Product.fetchOneById(productId, (product) => {
    Cart.addProduct(productId, product.price)
  })
  res.redirect("/cart")
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  })
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/Checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  })
}
