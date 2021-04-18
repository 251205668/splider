let puppteer = require('puppeteer')
const axios = require('axios')
const hotMovie = require('../models/hotMovie')
const movieList = require('../models/movieList')
const movieDeatil = require('../models/movieDeatil')
const tv = require('../models/tv')
const tvDetail = require('../models/tvDetail')
let options = {
  headless: true,
  // slowMo: 240,
  defaultViewport: {
    width: 1600,
    height: 800,
  },
  timeout: 1000000,
}
// movie
const HOT_TAGS = [
  '热门',
  '最新',
  '豆瓣高分',
  '冷门佳片',
  '华语',
  '欧美',
  '韩国',
  '日本',
]
const ALL_TAGS = [
  '热门',
  '最新',
  '经典',
  '可播放',
  '豆瓣高分',
  '冷门佳片',
  '华语',
  '欧美',
  '韩国',
  '日本',
  '动作',
  '喜剧',
  '爱情',
  '科幻',
  '悬疑',
  '恐怖',
  '动画',
]

// tv
const HOT_TV_TAGS = [
  '热门',
  '国产剧',
  '综艺',
  '美剧',
  '日剧',
  '韩剧',
  '日本动画',
  '纪录片',
]

const ALL_TV_TAGS = [
  '热门',
  '美剧',
  '英剧',
  '韩剧',
  '日剧',
  '国产剧',
  '港剧',
  '日本动画',
  '综艺',
  '纪录片',
]

// urls-movie or tv

const getUrls = (tags, limit, type) => {
  return tags.map(
    (item, index) =>
      `https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURI(
        item
      )}&page_limit=${limit}&page_start=0`
  )
}

var result = require('./result')
var tvresult = require('./tvresult')
var playingURLS = [
  'https://m.douban.com/movie/subject/33454993/',
  'https://m.douban.com/movie/subject/27121248/',
  'https://m.douban.com/movie/subject/26382960/',
  'https://m.douban.com/movie/subject/30279836/',
  'https://m.douban.com/movie/subject/35158160/',
  'https://m.douban.com/movie/subject/26613692/',
  'https://m.douban.com/movie/subject/30466931/',
  'https://m.douban.com/movie/subject/35131877/',
  'https://m.douban.com/movie/subject/1291571/',
  'https://m.douban.com/movie/subject/26818326/',
  'https://m.douban.com/movie/subject/34880302/',
  'https://m.douban.com/movie/subject/35196653/',
  'https://m.douban.com/movie/subject/35165314/',
  'https://m.douban.com/movie/subject/34804147/',
  'https://m.douban.com/movie/subject/34784899/',
  'https://m.douban.com/movie/subject/35418759/',
  'https://m.douban.com/movie/subject/35154209/',
  'https://m.douban.com/movie/subject/34841067/',
  'https://m.douban.com/movie/subject/27619748/',
  'https://m.douban.com/movie/subject/35026727/',
  'https://m.douban.com/movie/subject/1652587/',
  'https://m.douban.com/movie/subject/35367758/',
  'https://m.douban.com/movie/subject/34428905/',
  'https://m.douban.com/movie/subject/34825886/',
]
const playingMovie = require('../models/playingMovie')
const hotTv = require('../models/hotTv')
const tvList = require('../models/tvList')

// 抓取正在热映
async function getPlayingMovies() {
  const res = await axios({
    url:
      'https://m.douban.com/rexxar/api/v2/movie/modules?need_manual_chart_card=1&for_mobile=1',
    method: 'GET',
    headers: {
      Referer: 'https://m.douban.com/movie/',
    },
  })
  // 获取当前热映列表
  const playlist = res.data.modules[5].data.subject_collection_boards[0].items
  // 组装存入数据库的数组
  const playingList = playlist.map((item) => {
    playingURLS.push(item.url)
    return {
      id: Number(item.url.replace(/[^0-9]/gi, '')),
      cover: item.cover.url,
      rate: item.rating ? item.rating.value : 0,
      title: item.title,
      url: item.url,
      publicTime: `${item.year}-${item.release_date}`,
    }
  })
  for (let item of playingList) {
    try {
      await playingMovie.create(item)
      console.log(`${item.title} 存入数据库成功`)
    } catch (error) {
      console.log(error)
    }
  }
  console.log('任务完成')
}

// 抓取豆瓣热门 分为不同tag
async function getHotMoviesByTags(tag, subjects, type) {
  // const res = await axios.get(`https://movie.douban.com/j/search_subjects?type=movie&tag=${tag}&page_limit=50&page_start=0`)
  // const subjects = res.data.subjects
  // 首先组装好数据，然后过滤掉已有的电影，然后存入数据库
  for (let item of subjects) {
    const id = item.id
    const exist =
      type === 'hot'
        ? await hotTv.findOne({ id })
        : await tvList.findOne({ id })
    const total = await tvList.findOne({ id })
    if (!exist) {
      try {
        const obj = {
          id,
          cover: item.cover,
          rate: item.rate,
          title: item.title,
          url: item.url,
          tag,
          episodes_info: item.episodes_info,
        }
        type === 'hot'
          ? await hotTv.create(obj)
          : await tvList.create(obj)
        if (!total) {
          tvresult.push(item.url)
        }
        type === 'hot'
          ? console.log(`热门电视: ${item.title}存入数据库成功`)
          : console.log(`全部电视: ${item.title}存入数据库成功`)
      } catch (error) {
        console.log(error)
      }
    }
  }
}

// 抓取电影的详情信息

async function getHotMovieDetail(urls, limit) {
  const browser = await puppteer.launch(options)
  let length = urls.length
  let result = Array(length).fill(false)
  let count = 0
  return new Promise(async (resolve) => {
    while (count < limit) {
      next()
    }
    // 获取视频源
    async function getmp4Url(href) {
      let newPage = await browser.newPage()
      await newPage.goto(href)
      let url = await newPage.$eval('source', (ele) => ele.getAttribute('src'))
      newPage.close()
      return url
    }
    async function next() {
      let current = count++
      if (current >= length) {
        !result.includes(false) && resolve(result)
        console.log('当前抓取电视的详情信息任务完成')
        return
      }
      let url = urls[current]
      let id = Number(url.replace(/[^0-9]/gi, ''))
      console.log(`开始抓取第${current}个接口，url为${url}`)
      // 业务逻辑代码
      let page = await browser.newPage()
      page.setDefaultNavigationTimeout(1000000)
      await page.goto(url)
      // 组装参数
      let detail = null
      let title = ''
      try {
        title = await page.$eval('#content h1', (ele) => ele.innerText)
      } catch (error) {
        title = ''
      }
      let summary = ''
      try {
        summary = await page.$eval('#link-report', (ele) => ele.innerText)
      } catch (error) {
        summary = ''
      }
      let mixInfo = null
      try {
        mixInfo = await page.$$eval('#info .attrs', (eles) => {
          return {
            author: eles[0].innerText,
            scriptWriter: eles[1].innerText,
          }
        })
      } catch (error) {
        mixInfo = null
      }
      let mediaType = ''
      try {
        mediaType = await page.$$eval(
          "#info span[property='v:genre']",
          (eles) => {
            let str = ''
            eles.forEach((item) => {
              str += item.innerText + ' '
            })
            return str
          }
        )
      } catch (error) {
        mediaType = ''
      }
      // 演员表
      let actors = null
      try {
        actors = await page.$$eval('.celebrities-list li', (eles) => {
          let arr = []
          eles.forEach((item) => {
            let avatar = item.querySelector('.avatar').style
              ? item
                  .querySelector('.avatar')
                  .style.backgroundImage.replace(/url\(\"/g, '')
                  .replace(/\"\)/g, '')
              : ''
            let name = item.querySelector('.name').innerText
            let role = item.querySelector('.role').innerText
            arr.push({
              avatar,
              name,
              role,
            })
          })
          return arr
        })
      } catch (error) {
        actors = null
      }

      // 上映时间
      let publicTime = ''
      try {
        publicTime = await page.$$eval(
          "#info span[property='v:initialReleaseDate']",
          (eles) => {
            let str = ''
            eles.forEach((item) => {
              str += item.innerText + ' '
            })
            return str
          }
        )
      } catch (error) {
        publicTime = ''
      }
      // 时长
      let duration = ''
      try {
        duration = await page.$eval(
          "#info span[property='v:runtime']",
          (ele) => ele.innerText
        )
      } catch (error) {
        duration = ''
      }

      // 封面
      let cover = ''
      try {
        cover = await page.$eval('#mainpic img', (ele) =>
          ele.getAttribute('src')
        )
      } catch (error) {
        cover = ''
      }

      // 预告片
      let video = null
      try {
        video = await page.$eval('.related-pic-video', (ele) => {
          let obj = {}
          // 预告片封面图
          obj.post = ele.style
            ? ele.style.backgroundImage
                .replace(/url\(\"/g, '')
                .replace(/\"\)/g, '')
            : ''
          // 预告片视频源
          let href = ele.getAttribute('href')
          obj.href = href
          return obj
        })
        // 获取预告片的视频源
        video.url = video.href ? await getmp4Url(video.href) : ''
      } catch (error) {
        video = null
      }
      let average = ''
      try {
        average = await page.$eval(
          "strong[property='v:average']",
          (ele) => ele.innerText
        )
      } catch (error) {
        average = ''
      }
      let nums = ''
      try {
        nums = await page.$eval(
          "span[property='v:votes']",
          (ele) => ele.innerText
        )
      } catch (error) {
        nums = ''
      }

      let rateRange = []
      try {
        rateRange = await page.$$eval(
          '.ratings-on-weight .rating_per',
          (eles) => {
            let arr = []
            eles.forEach((item) => {
              arr.push(item.innerText)
            })
            return arr
          }
        )
      } catch (error) {
        rateRange = []
      }
      let rate = { average, nums, rateRange }
      // 推荐列表
      let recommendList = []
      try {
        recommendList = await page.$$eval('.recommendations-bd dl', (eles) => {
          let arr = []
          eles.forEach((item) => {
            let cover = item.querySelector('img').getAttribute('src')
            let title = item.querySelector('dd a').innerText
            arr.push({ cover, title })
          })
          return arr
        })
      } catch (error) {
        recommendList = []
      }

      // 热评列表
      let contentArr = []
      try {
        contentArr = await page.$$eval('.comment-content', (eles) => {
          let arr = []
          eles.forEach((item, index) => {
            arr.push(item.innerText)
          })
          return arr
        })
      } catch (error) {
        contentArr = []
      }
      let hotComments = []
      try {
        hotComments = await page.$$eval('.comment-info', (eles) => {
          let arr = []
          eles.forEach((item, index) => {
            let username = item.querySelector('a').innerText
            let commentTime = item.querySelector('.comment-time').innerText
            arr.push({
              username,
              commentTime,
            })
          })
          return arr
        })
        contentArr.forEach((item, index) => {
          hotComments[index] = { ...hotComments[index], content: item }
        })
      } catch (error) {
        hotComments = []
      }
      detail = {
        id,
        title,
        summary,
        ...mixInfo,
        actors,
        mediaType,
        publicTime,
        rate,
        duration,
        cover,
        video,
        recommendList,
        hotComments,
      }
      // 组装总的参数，存入数据库，事先去重
      try {
        await tvDetail.create(detail)
        result[current] = true
        console.log(`${detail.title} 详情数据抓取成功`)
        page.close()
        if (current < length) {
          next()
        }
      } catch (error) {
        result[current] = error
        console.log(`第${current}个请求发生错误`)
        page.close()
        if (current < length) {
          next()
        }
      }
    }
  })
}

// 主逻辑
async function splider() {
  // // 抓取热门电影
  // await mutilyRequest(getUrls(HOT_TAGS, 50, 'movie'), 10, 'hot')
  // // 抓取全部电影
  // await mutilyRequest(getUrls(ALL_TAGS, 10000, 'movie'), 10, 'all')
  // // 拿到最终的url数组 然后获取详情
  // await tv.create({result})
  // let existUrls = []
  // let movies = await movieDeatil.find()
  // existUrls = movies.map(item => `https://movie.douban.com/subject/${item.id}/`)
  // result = result.filter(item => !existUrls.includes(item))
  // await getHotMovieDetail(result, 20)
  // console.log('写入完成')
  // 抓取热映电影
  // await getPlayingMovies()
  // console.log(playingURLS)
  // 详情
  // await getHotMovieDetail(playingURLS, 5)
  // 热映电视剧
  // 全部分类电视剧
  // 电视剧详情

  let tvs = await tvDetail.find()
  let existUrls = tvs.map(item => `https://movie.douban.com/subject/${item.id}/`)
  tvresult = tvresult.filter(item => !existUrls.includes(item))
  await getHotMovieDetail(tvresult, 10)
}

async function mutilyRequest(urls, limit, type) {
  let length = urls.length
  let result = Array(length).fill(false)
  let count = 0
  return new Promise((resolve) => {
    while (count < limit) {
      next()
    }
    async function next() {
      let current = count++
      if (current >= length) {
        !result.includes(false) && resolve(result)
        console.log('任务完成')
        return
      }
      let url = urls[current]
      console.log(`开始请求第${current}个接口,请求的url为${url}`)
      axios
        .get(url)
        .then(async (res) => {
          result[current] = res.data
          const subjects = res.data.subjects
          const currentTag =
            type === 'hot' ? HOT_TV_TAGS[current] : ALL_TV_TAGS[current]
          console.log('请求已完成')
          await getHotMoviesByTags(currentTag, subjects, type)
          if (current < length) {
            next()
          }
        })
        .catch((error) => {
          result[current] = error
          console.log(error)
          if (current < length) {
            next()
          }
        })
    }
  })
}

splider()

// getPlayingMovies()

// function ajax(url){
//   return new Promise(resolve=>{
//     resolve(`当前请求${url}`)
//   })
// }

// mutilyRequest(['0','1','2','3','4','5','6','7','8','9','10'],4).then(res=>{
//   console.log(res)
// })
