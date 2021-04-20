/* eslint-disable */
const axios = require('axios')
const FormData = require('form-data')

async function getData() {
  let form = new FormData()
  form.append('vkey','07fezqznmj7%2BpXWsaZ67%2BSxuDln6U8EdWNIJH1b3scqt3k25QqynkLmomTcRJq1Ketx1PUJ50DOqlOBeJiFfYQ%2B7oiUyKqaZBpqIgnrg%2B44GSQLrvsgT8f2QXZtDel1SPpvZOnDkHCcwT%2Bb44eJhksTrNM%2FBTUocdE4')
  // 此处和原生写法不同 In Node.js environment you need to set boundary in the header field 'Content-Type' by calling method `getHeaders`
  const formHeaders = form.getHeaders();
  const res = await axios.post('https://api.yueliangjx.com/5222.php',form,{
    headers: {
      ...formHeaders
    }
  })
  console.log(res.data)
}

async function getdata() {
  const res = await axios({
    url: 'https://cn-hbwh-cmcc-bcache-03.bilivideo.com/upgcxcode/46/41/324884146/324884146_nb2-1-32.flv?e=ig8euxZM2rNcNbNM7WdVhoMg7wUVhwdEto8g5X10ugNcXBlqNxHxNEVE5XREto8KqJZHUa6m5J0SqE85tZvEuENvNo8g2ENvNo8i8o859r1qXg8xNEVE5XREto8GuFGv2U7SuxI72X6fTr859r1qXg8gNEVE5XREto8z5JZC2X2gkX5L5F1eTX1jkXlsTXHeux_f2o859IB_&uipk=5&nbs=1&deadline=1618670493&gen=playurlv2&os=bcache&oi=3084491083&trid=39ef334c352a4b56adbbdb6adefdc2b4u&platform=pc&upsig=14a83534700d8951afc4ae9df865666c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&cdnid=10199&mid=0&orderid=0,3&agrr=0&logo=80000000',
    method:'GET',
    headers: {
      'Referer': 'https://www.bilibili.com',
      'User-Agent':'12'
    },
    responseType: 'blob',
  })
  let blob = new Blob([res.data])
  let url = URL.createObjectURL(blob)
  console.log(url)
}

getdata()
getData()
