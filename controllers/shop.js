const Product = require("../models/product")

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      console.log(products)
      res.render("shop/product-list", {
        products,
        pageTitle: "All products",
        path: "/products",
      })
    })
    .catch((err) => console.log(err))
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      })
    })
    .catch((err) => console.error(err))
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      })
    })
    .catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products,
          })
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

exports.deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body
    console.log(await req.user)
    const cart = await req.user.getCart()
    const productSeq = await cart.getProducts({ where: { id: productId } })
    const product = await productSeq[0]
    await product.cartItem.destroy()
    await res.redirect("/cart")
  } catch (err) {
    console.log(err)
  }
}

exports.postCart = async (req, res) => {
  try {
    const { productId } = req.body

    const cart = await req.user.getCart()
    const productSequelize = await cart.getProducts({
      where: { id: productId },
    })

    const manageProductAndQty = async () => {
      if (productSequelize.length) {
        const product = productSequelize[0]
        const oldQuantity = product.cartItem.quantity
        const quantity = oldQuantity + 1
        return { product, quantity }
      } else {
        const product = await Product.findByPk(productId)
        return { product, quantity: 1 }
      }
    }

    const { product, quantity } = await manageProductAndQty()
    await cart.addProduct(product, {
      through: { quantity: quantity },
    })
    await res.redirect("/cart")
  } catch (err) {
    console.log(err)
  }
}

exports.postOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart()
    const products = await cart.getProducts()
    const order = await req.user.createOrder()
    await order.addProducts(
      products.map((product) => {
        product.orderItem = {
          quantity: product.cartItem.quantity,
        }
        return product
      })
    )
    await cart.setProducts(null)
    await res.redirect("/orders")
  } catch (err) {
    console.log(err)
  }
}

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] })
    await res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    })
    console.log(await orders)
  } catch (err) {
    console.log(err)
  }
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/Checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  })
}
