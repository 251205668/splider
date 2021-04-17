const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const HotMovieSchema = new Schema({
  id: String,
  cover: String,
  rate: String,
  title: String,
  url: String,
  // 0: "热门"
  // 1: "最新"
  // 2: "豆瓣高分"
  // 3: "冷门佳片"
  // 4: "华语"
  // 5: "欧美"
  // 6: "韩国"
  // 7: "日本"
  tag: String,
  // 更新至第几集
  episodes_info:String
})
module.exports = Mongoose.model('HotMovie',HotMovieSchema)
