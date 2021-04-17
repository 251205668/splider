let puppteer = require('puppeteer')
const book = require('../models/bookList')
const bookDetailModel = require('../models/bookDetail')
let options = {
  headless: true,
  // slowMo: 240,
  defaultViewport:  {
    width:1600,
    height:800
  },
  timeout : 1000000 
}
async function splider() {
  // let result = []
  let browser = await puppteer.launch(options)
  let page = await browser.newPage()
  let pageNums = await getPageNum()
  for(let i = 278;i<=318;i++) {
    let bookList = await getPageInfo(i)
    for(let item of bookList) {
      // 保存图书信息
      try {
        await book.create(item)
      } catch (error) {
        console.log(error)
      }
      let bookDetail = await getBookInfo(item.url)
      try {
        await bookDetailModel.create({...bookDetail,bookId:item.bookId})
        console.log(`${item.title} 存入数据库成功`)
      } catch (error) {
        console.log(error)
      }
    }
  }
  console.log('当前任务完成')

  async function getPageNum() {
    await page.goto('https://sobooks.cc/')
    page.setDefaultNavigationTimeout(1000000)
    // 获取页数
    let pageNum = await page.$eval('.pagination li:last-child span',(ele) => {
      let text = ele.innerHTML
      return Number(text.split(' ')[1])
    })
    page.close()
    return pageNum
  }
  // 获取当前页的所有图书信息
  async function getPageInfo(num) {
    let newPage = await browser.newPage()
    newPage.setDefaultNavigationTimeout(1000000)
    await newPage.goto(`https://sobooks.cc/page/${num}`)
    // 抓取图书信息
    let bookList =  await newPage.$$eval('.card .card-item .thumb-img>a',(elements) => {
      let arr = []
      elements.forEach((ele,index) => {
        arr.push({
          bookId: Number(ele.getAttribute('href').replace(/[^0-9]/ig, '')),
          url: ele.getAttribute('href'),
          title: ele.getAttribute('title'),
          img: ele.querySelector('img').getAttribute('data-original'),
          author: ele.parentNode.parentNode.querySelector('p>a').innerHTML,
          authorPath:ele.parentNode.parentNode.querySelector('p>a').getAttribute('href'),
        })
      })
      return arr
    })
    newPage.close()
    return bookList
  }

  // 获取书籍的详情信息
  async function getBookInfo(url) {
    let bookPage = await browser.newPage()
    bookPage.setDefaultNavigationTimeout(1000000)
    await bookPage.goto(url)
    // 书名 作者 格式 标签 时间 内容 
    let category = await bookPage.$eval('.meta span:first-child>a',(ele) => {
      return ele.innerHTML.trim()
    })
    let img = await bookPage.$eval('.bookpic>img',ele=>ele.getAttribute('src'))
    let bookInfo =  await bookPage.$$eval('.book-info .bookinfo li',elements => {
      return {
        title:elements[0].innerText.split('：')[1],
        author:elements[1].innerText.split('：')[1], 
        extra:elements[2].innerText.split('：')[1], 
        tag:elements[3].innerText.split('：')[1], 
        updateTime:elements[4].innerText.split('：')[1] 
      }
    })
    let content = await bookPage.$$eval('.article-content p',elements=>{
      let str = ''
      elements.forEach(ele=>{
        str += ele.innerText
      })
      return str
    })
    bookPage.close()
    return {category,img,...bookInfo,content}
  }
}

splider()


