const fs = require("fs")
const path = require("path")

const rootDir = require("../utils/path")

const pathOfFile = path.join(rootDir, "data", "products.json")

function getProductsFromFile(cb) {
  fs.readFile(pathOfFile, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    cb(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
  }

  save() {
    this.id = Math.random().toString()
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(pathOfFile, JSON.stringify(products), (err) => {
        console.log(err)
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
