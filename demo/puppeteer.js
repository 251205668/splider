const puppeteer = require('puppeteer')
async function test() {
  // 窗口配置
  let options = {
    defaultViewport: {
      width: 1400,
      height:800
    },
    // 有界面
    headless: false,
    slowMo: 250
  } 
  let browser = await puppeteer.launch(options)
  // 新开页面实例
  let page = await browser.newPage()
  await page.goto('https://movie.douban.com/')
  await page.screenshot({path: 'screen.png'})
  let elements = await page.$$eval('#db-nav-movie .nav-secondary .nav-items li a',(element) => {
    let result = []
    element.forEach(item => {
      result.push({
        url: item.getAttribute('href'),
        title: item.innerHTML
      })
    })
    return result
  })
  // 获取数据
  console.log(elements)

  // // 打开新页面
  // let subPage = await browser.newPage()
  // await subPage.goto(elements[1].url)

  // 操作页面，搜索小丑
  let inputElement = await page.$('#inp-query')
  let submitElement = await page.$('.inp-btn input')
  await inputElement.focus()
  await page.keyboard.type('小丑')
  await submitElement.click()

  // 监听数据
  // page.on('console',(e) => {
  //   console.log(e.text())
  // })
}
test()

