// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   { dialect: "mysql", host: process.env.DB_HOST }
// )

// module.exports = sequelize

const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oygt6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    _db = await client.db()
    await callback()
  } catch (err) {
    console.log(err)
    throw err
  }
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw "No database found"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
