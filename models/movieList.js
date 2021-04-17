const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const MovieListSchema = new Schema({
  id: String,
  cover: String,
  rate: String,
  title: String,
  url: String,
  // 0: "热门"
  // 1: "最新"
  // 2: "经典"
  // 3: "可播放"
  // 4: "豆瓣高分"
  // 5: "冷门佳片"
  // 6: "华语"
  // 7: "欧美"
  // 8: "韩国"
  // 9: "日本"
  // 10: "动作"
  // 11: "喜剧"
  // 12: "爱情"
  // 13: "科幻"
  // 14: "悬疑"
  // 15: "恐怖"
  // 16: "动画"
  tag: String,
  // 更新至第几集
  episodes_info:String
})
module.exports = Mongoose.model('movieList',MovieListSchema)
