
const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const TvSchema = new Schema({
 result: Array
})
module.exports = Mongoose.model('tv',TvSchema)
