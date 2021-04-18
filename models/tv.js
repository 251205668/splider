const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const tv = new Schema({
  result:Array
})
module.exports = Mongoose.model('tv',tv)
