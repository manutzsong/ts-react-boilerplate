/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import APICallString from '../utils/signKey'
import FetchAdapter from '../utils/fetchAdapter'
import { storage } from '@extend-chrome/storage'
import lazadaAPI from '../utils/lazadaAPI'
import md5 from 'md5'
import GenStudentBill from '../utils/genStudentBill'
import { LazadaOrder } from '../pages/types/LazadaOrderType'

const _waitForElement = (
  selector: string,
  delay = 50,
  tries = 250,
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector)
      if (element) {
        clearInterval(interval)
        resolve(element)
      } else if (tries === 0) {
        clearInterval(interval)
        reject(null)
      }
      tries--
    }, delay)
  })
}

const init = async () => {
  const dataSync = await storage.sync.get()
  const dataLocal = await storage.local.get()

  console.log(dataSync, dataLocal)

  const toolbarContainer = await _waitForElement('div.toolbar-container')
  /* manipulate add button */
  toolbarContainer.insertAdjacentHTML(
    'afterbegin',
    `
    <div>
        <button id="print-student">Print</button>
    </div>
  `,
  )
  document.getElementById('print-student')?.addEventListener('click', getOrders)
}
init()

const getOrders = async () => {
  const aElements = document.querySelectorAll('a')
  if (aElements) {
    const orders = [...aElements]
      .filter((elm) =>
        [...elm.attributes].some((attrib) =>
          attrib.name.startsWith('data-more'),
        ),
      )
      .filter(
        (a) =>
          a?.parentElement?.parentElement?.previousElementSibling?.querySelector(
            'input',
          )?.checked,
      )

    const orderIds = orders.flatMap((a) => a.textContent ?? '')
    const orderIdsPromises = orderIds.map((orderId) =>
      lazadaAPI.getOrders(orderId),
    )
    const ordersResults:LazadaOrder[] = await Promise.all(orderIdsPromises)

    const printLabelPromises = ordersResults.map((x) => {
      const orderId = x.data.data[0].orderNumber
      const tradeOrderLineIds = x.data.data[6].dataSource?.map(// tradeOrderLineIds are each item id in the order
        (x) => x.orderLineId,
      )
      return lazadaAPI.getPrintLabel(
        orderId as string,
        tradeOrderLineIds as string[],
      )
    });

    const printLabelResults = await Promise.all(printLabelPromises);
    console.log(printLabelResults);


    GenStudentBill(ordersResults, printLabelResults);
  }
}
