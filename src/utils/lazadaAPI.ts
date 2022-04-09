import APICallString from './signKey'
import fetchAdapter from './fetchAdapter'
import { LazadaOrder } from '../pages/types/LazadaOrderType'
import { LazadaPrintLabel } from '../pages/types/LazadaPrintLabel'

const getOrders = async (orderID: string): Promise<LazadaOrder> => {
  const data = {
    _timezone: -7,
    spm: 'a1zawg.20980230.order_table_0.1.21ac4edfymPXAz',
    tradeOrderId: orderID,
  }
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.query.detail/1.0/?jsv=2.3.16&appKey=4272&t=1620042606731&sign=0966d19a2bce55bc8f957b5f49f577aa&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.query.detail&type=originaljson&method=GET&api=mtop.lazada.seller.order.query.detail&headers=%5Bobject%20Object%5D&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22_timezone%22%3A-7%2C%22spm%22%3A%22a1zawg.20980230.order_table_0.1.21ac4edfymPXAz%22%2C%22tradeOrderId%22%3A%22387476782740391%22%7D',
    data,
    '4272',
  )
  const resultAPI = await fetchAdapter.fetchGetAdapt(resultAPICall)
  return new Promise((resolve) => resolve(resultAPI as LazadaOrder))
}

const getPrintLabel = async (
  orderID: string,
  orderItemIds: string[],
): Promise<string> => {
  const data = {
    _timezone: -7,
    processRequest: JSON.stringify({
      orders: [
        { orderId: orderID, orderItemIds: orderItemIds },
      ],
      types: ['awb'],
      source: 'completeHtmlAwb',
    }),
  }
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.package.print/1.0/?jsv=2.6.1&appKey=4272&t=1649429102708&sign=8ba95bf3acafeab5fc5ca3be358b6a80&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.package.print&type=originaljson&method=POST&noUrlQuery=true&api=mtop.lazada.seller.order.package.print&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH',
    data,
    '4272',
  )
  const resultAPI: LazadaPrintLabel = (await fetchAdapter.fetchPostAdapter(
    resultAPICall,
    data,
  )) as LazadaPrintLabel

  return new Promise((resolve) => {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(
      resultAPI.data.data[0].eventParams.patchs[0].pages[0],
      'text/html',
    )
    const printLabel = htmlDoc.documentElement.querySelector('img')?.src
    resolve(printLabel ?? '')
  })
}

export default { getOrders, getPrintLabel }
