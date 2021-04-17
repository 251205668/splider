const Mongoose = require('../config/Mongoose')

// userSchema
const Schema = Mongoose.Schema
const BookSchema = new Schema({
  bookId: Number,
  url: String,
  title: String,
  img: String,
  author: String,
  authorPath: String
})

module.exports = Mongoose.model('Book',BookSchema)
