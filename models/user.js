const getDb = require("../utils/database").getDb

const mongodb = require("mongodb")

const { ObjectId } = mongodb

class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  async save() {
    try {
      const db = await getDb()
      return await db.collection("users").insertOne(this)
    } catch (error) {
      console.log(error)
    }
  }

  static async findById() {
    try {
      const db = await getDb()
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) })
      return await user
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = User
