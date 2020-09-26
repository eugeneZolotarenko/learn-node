const fs = require("fs")
const path = require("path")

const rootDir = require("../utils/path")

const pathOfFile = path.join(rootDir, "data", "cart.json")

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(pathOfFile, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      )
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(pathOfFile, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(pathOfFile, (err, fileContent) => {
      if (err) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.findIndex((prod) => prod.id === id)
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      )
      if (!product) {
        return
      }
      const productQty = product.qty
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty

      fs.writeFile(pathOfFile, JSON.stringify(updatedCart), (err) => {
        console.log(err)
      })
    })
  }

  static getCart(cb) {
    fs.readFile(pathOfFile, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        cb(null)
      } else {
        cb(cart)
      }
    })
  }
}
