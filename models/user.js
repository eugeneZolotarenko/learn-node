const getDb = require("../utils/database").getDb

const mongodb = require("mongodb")

class User {
  constructor(name, email, cart, id) {
    this.name = name
    this.email = email
    this.cart = cart
    this._id = id
  }

  async save() {
    try {
      const db = await getDb()
      return await db.collection("users").insertOne(this)
    } catch (error) {
      console.log(error)
    }
  }

  addToCart(product) {
    const cartProducts = this.cart.item.findIndex(
      (cp) => cp._id === product._id
    )
    const updatedCart = { items: [{ ...product, quantity: 1 }] }
    const db = getDb()
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  static async findById(id) {
    try {
      const db = await getDb()
      const user = await db
        .collection("users")
        .findOne({ _id: new mongodb.ObjectId(id) })
      return await user
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = User
