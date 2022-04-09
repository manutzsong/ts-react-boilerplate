/* eslint-disable prefer-const */
import md5 from 'md5'

const getCookie = (cookieName: string) => {
  const cookie = document.cookie
  const cookieList = cookie.split('; ')
  for (let i = 0; i < cookieList.length; i++) {
    const cookieItem = cookieList[i].split('=')
    if (cookieItem[0] === cookieName) {
      return cookieItem[1]
    }
  }
  return ''
}

const signKey = (dataJSON: any, appKey: string) => {
  let token = getCookie('_m_h5_tk').split('_')[0]
  console.log(token)
  appKey = appKey ? appKey : '4272'
  const t = new Date().getTime()
  let data = JSON.stringify(dataJSON)
  const groupUp = token + '&' + t + '&' + appKey + '&' + data
  console.log(groupUp)
  return [md5(groupUp), t]
}

const APICallString = (urlBefore: string, data: any, appKey: string) => {
  //fetch url get url
  let signKeyAndTimeStamp = signKey(data, appKey)
  let sign = signKeyAndTimeStamp[0]
  let t = signKeyAndTimeStamp[1]

  let url = new URL(urlBefore)
  url.searchParams.set('t', t as string)
  url.searchParams.set('sign', sign as string)
  // if (data) {
    url.searchParams.set('data', JSON.stringify(data))
  // }
  return url.toString()
}
export default APICallString
