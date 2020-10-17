const mongoose = require("mongoose")

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

module.exports = mongoose.model("Product", productSchema)

// const getDb = require("../utils/database").getDb

// const mongodb = require("mongodb")

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title
//     this.price = price
//     this.imageUrl = imageUrl
//     this.description = description
//     this._id = id && new mongodb.ObjectId(id)
//     this.userId = userId
//   }

//   async save() {
//     try {
//       const db = await getDb()
//       if (this._id) {
//         return await db
//           .collection("products")
//           .updateOne({ _id: this._id }, { $set: this })
//       } else {
//         return await db.collection("products").insertOne(this)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = await getDb()
//       return await db.collection("products").find().toArray()
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async findById(id) {
//     try {
//       const db = await getDb()
//       const product = await db
//         .collection("products")
//         .findOne({ _id: new mongodb.ObjectId(id) })
//       return await product
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async deleteById(id) {
//     console.log(id)
//     try {
//       const db = await getDb()
//       await db
//         .collection("products")
//         .deleteOne({ _id: new mongodb.ObjectId(id) })
//       return await db.collection("users").updateOne(
//         { _id: new mongodb.ObjectId(userId) },
//         {
//           $pull: {
//             "cart.items": { productId: new ObjectId(prodId) },
//           },
//         }
//       )
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

// module.exports = Product
