const Mongoose = require('../config/Mongoose')

// userSchema
const Schema = Mongoose.Schema
const BookDetailSchema = new Schema({
  bookId: Number,
  category: String,
  title: String,
  img: String,
  author: String,
  extra: String,
  tag: String,
  updateTime: String,
  content: String
})

module.exports = Mongoose.model('BookDetail',BookDetailSchema)
