const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const TvListSchema = new Schema({
  id: String,
  cover: String,
  rate: String,
  title: String,
  url: String,
  // 0: "热门"
  // 1: "美剧"
  // 2: "英剧"
  // 3: "韩剧"
  // 4: "日剧"
  // 5: "国产剧"
  // 6: "港剧"
  // 7: "日本动画"
  // 8: "综艺"
  // 9: "纪录片"
  tag: String,
  // 更新至第几集
  episodes_info:String
})
module.exports = Mongoose.model('tvList',TvListSchema)
