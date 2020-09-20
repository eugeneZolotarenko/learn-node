const fs = require("fs")
const path = require("path")

const rootDir = require("../utils/path")

const pathOfFile = path.join(rootDir, "data", "products")

function getProductsFromFile(cb) {
  fs.readFile(pathOfFile, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    cb(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(title) {
    this.title = title
  }

  save() {
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
}
