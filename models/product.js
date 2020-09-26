const fs = require("fs")
const path = require("path")

const rootDir = require("../utils/path")

const pathOfFile = path.join(rootDir, "data", "products.json")
const Cart = require("./cart")

function getProductsFromFile(cb) {
  fs.readFile(pathOfFile, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    cb(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        )
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(pathOfFile, JSON.stringify(updatedProducts), (err) => {
          console.error(err)
        })
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(pathOfFile, JSON.stringify(products), (err) => {
          console.error(err)
        })
      }
    })
  }

  static delete(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id)
      const updatedProducts = products.filter((prod) => prod.id !== id)
      fs.writeFile(pathOfFile, JSON.stringify(updatedProducts), (err) => {
        console.error(err)
        if (!err) {
          Cart.deleteProduct(id, product)
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static fetchOneById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      cb(product)
    })
  }
}
