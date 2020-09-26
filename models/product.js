const db = require("../utils/database")

const Cart = require("./cart")

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.price = price
    this.description = description
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    )
  }

  static delete(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products")
  }

  static fetchOneById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id])
  }
}
