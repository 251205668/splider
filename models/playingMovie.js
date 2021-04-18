const Mongoose = require('../config/Mongoose')

const Schema = Mongoose.Schema
const playingMovieSchema = new Schema({
  id: String,
  cover: String,
  rate: Number,
  title: String,
  url: String,
  publicTime: String
})

module.exports = Mongoose.model('playing',playingMovieSchema)
