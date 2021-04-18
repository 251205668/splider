const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const HotTvSchema = new Schema({
  id: String,
  cover: String,
  rate: String,
  title: String,
  url: String,
  // 0: "热门"
  // 1: "国产剧"
  // 2: "综艺"
  // 3: "美剧"
  // 4: "日剧"
  // 5: "韩剧"
  // 6: "日本动画"
  // 7: "纪录片"
  tag: String,
  // 更新至第几集
  episodes_info:String
})
module.exports = Mongoose.model('HotTv',HotTvSchema)
