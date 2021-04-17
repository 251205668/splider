const Mongoose = require('../config/Mongoose')
const Schema = Mongoose.Schema
const MovieDetailSchema = new Schema({
  id: String,
  title: String,
  summary: String,
  // 导演
  author: String,
  // 编剧
  scriptWriter:String,
  // 演员表 actors:[{name:'',avatar:'',role:''}]
  actors: Array,
  // 媒体类型
  mediaType: String,
  // 上映日期
  publicTime:String,
  // 需要特殊处理
  /**
   * rate: {
   *   score: // 评分,
   *   nums: 评分人数
   *   stars: ['10%',] 五星到1星的比率
   * }
   */
  rate: Object,
  duration: String,
  cover: String,
  video: Object,
  // [{title:'',cover:'',url:'',type''}]
  recommendList: Array,
  // [{username:'',content:'',updateTime:''}]
  hotComments:Array
})

module.exports = Mongoose.model('movieDetail',MovieDetailSchema)

