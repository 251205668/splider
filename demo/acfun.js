const axios = require('axios')
const cheerio = require('cheerio')
const jsdom = require('jsdom')
const {JSDOM} = jsdom


async function splider() {
  const url = 'https://www.acfun.cn/a/ac27722303'
  const res = await axios.get(url)
  const html = res.data
  const $ = cheerio.load(html)
  // 执行html的脚本 并提取出内容
  const dom = new JSDOM(html, { runScripts: "dangerously" })
  const articleInfo = dom.window.articleInfo
  const articleContentHtml = articleInfo.parts[0].content
  
  // 插入html
  $('.article-content').html(articleContentHtml);
  const articleContent = $('.article-content')
  const doms = articleContent.find('p,div,p>img,div>img')
  const content = []
  doms.map((index,ele) => {
    const text = $(ele).text()
    if(text) {
      content.push(text)
    }else if(ele.name === 'img') {
      const src = $(ele).attr('src')
      content.push(src)
    }
  })
  console.log(content,typeof(content))
}
splider()

