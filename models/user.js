const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, require: true },
      },
    ],
  },
})

userSchema.methods.addToCart = async function (product) {
  try {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    )
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      })
    }
    let updatedCart = {
      items: updatedCartItems,
    }
    this.cart = updatedCart
    return await this.save()
  } catch (error) {
    console.log(error)
  }
}

userSchema.methods.deleteFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString()
  })
  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.clearCart = async function () {
  this.cart = []
  return this.save()
}

module.exports = mongoose.model("User", userSchema)

// const getDb = require("../utils/database").getDb

// const mongodb = require("mongodb")

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name
//     this.email = email
//     this.cart = cart
//     this._id = id
//   }

//   async save() {
//     try {
//       const db = await getDb()
//       return await db.collection("users").insertOne(this)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async addToCart(product) {
//     try {
//       const cartProductIndex = this.cart.items.findIndex(
//         (cp) => cp.productId.toString() === product._id.toString()
//       )
//       let newQuantity = 1
//       const updatedCartItems = [...this.cart.items]
//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1
//         updatedCartItems[cartProductIndex].quantity = newQuantity
//       } else {
//         updatedCartItems.push({
//           productId: new mongodb.ObjectId(product._id),
//           quantity: newQuantity,
//         })
//       }
//       let updatedCart = {
//         items: updatedCartItems,
//       }
//       const db = await getDb()
//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: updatedCart } }
//         )
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async deleteFromCart(productId) {
//     try {
//       const newCart = {
//         items: this.cart.items.filter(
//           (p) => p.productId.toString() !== productId.toString()
//         ),
//       }
//       const db = await getDb()
//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: newCart } }
//         )
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async getCart() {
//     try {
//       const db = await getDb()
//       const productsIds = this.cart.items.map((p) => p.productId)
//       const productsArr = await db
//         .collection("products")
//         .find({ _id: { $in: productsIds } })
//         .toArray()
//       return productsArr.map((p) => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(
//             (i) => i.productId.toString() === p._id.toString()
//           ).quantity,
//         }
//       })
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async addOrder() {
//     try {
//       const db = getDb()
//       const products = await this.getCart()
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name,
//         },
//       }
//       await db.collection("orders").insertOne(order)
//       this.cart = { items: [] }
//       return await db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async getOrders() {
//     try {
//       const db = await getDb()
//       return await db
//         .collection("orders")
//         .find({ "user._id": new mongodb.ObjectId(this._id) })
//         .toArray()
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async findById(id) {
//     try {
//       const db = await getDb()
//       const user = await db
//         .collection("users")
//         .findOne({ _id: new mongodb.ObjectId(id) })
//       return await user
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

// module.exports = User
