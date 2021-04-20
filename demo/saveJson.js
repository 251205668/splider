/* eslint-disable */
const mockData = [
  {
    "_id": "60797ab8226c084ec094f811",
    "bookId": "18086",
    "url": "https://sobooks.cc/books/18086.html",
    "title": "怪谈：灵之日本",
    "img": "https://sobooks.cc/wp-content/themes/Git/timthumb.php?src=https://images-cn.ssl-images-amazon.cn/images/I/51hq8XU2DSL.jpg&h=260&w=190&q=90&zc=1&ct=1",
    "author": "小泉八云",
    "authorPath": "https://sobooks.cc/search/小泉八云",
    "__v": "0"
},
{
    "_id": "60797abb226c084ec094f813",
    "bookId": "18085",
    "url": "https://sobooks.cc/books/18085.html",
    "title": "二战东线全史（套装全13卷）",
    "img": "https://sobooks.cc/wp-content/themes/Git/timthumb.php?src=https://images-cn.ssl-images-amazon.cn/images/I/516JoAeHqeL.jpg&h=260&w=190&q=90&zc=1&ct=1",
    "author": "朱世巍",
    "authorPath": "https://sobooks.cc/search/朱世巍",
    "__v": "0"
}
]

const JSONStream = require('JSONStream')
const fs = require('fs')

// let t = JSON.stringify(mockData)
// fs.writeFileSync('data.json',t)

// 解析JSON
// var stream = fs.createReadStream('data.json',{encoding:'utf-8'})
// console.log(stream)

// var parse = JSONStream.parse('*')
// stream.pipe(parse)
// parse.on('root',obj => {
//   console.log(obj)
// })
