/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import lazadaAPI from '../utils/lazadaAPI';
import GenStudentBill from '../utils/genStudentBill';
import { LazadaOrder } from '../pages/types/LazadaOrderType';
import utils from '../utils/utils';
import GenStudentBillSeperate from '../utils/genStudentBillSeperate';
let intervalButtons: NodeJS.Timeout;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.message === 'hello!') {
    // this we will reinject the url
    console.log(request.details); // new url is now in content scripts!
    clearInterval(intervalButtons); // clear the inverval
    init(); // reinject the script
  }
});

const init = async () => {
  const addressRes = await lazadaAPI.getAddress();
  console.log(addressRes);
  const toolbarContainer = await utils.waitForElement('.order-toolbar-actions');

  /* manipulate add button */

  toolbarContainer.insertAdjacentHTML(
    'afterbegin',
    `
    <div style="padding-right: 1rem;">
      <button disabled class="next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp" id="print">Print Dropoff</button>
      <button disabled class="next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp" id="print-student">Print Dropoff + ใบเสร็จ</button>
      <button disabled class="next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp" id="print-student-seperate">Print Dropoff + ใบเสร็จ Seperate</button>
    </div>
  `,
  );
  const reInject = () => {
    clearInterval(intervalButtons); // clear the inverval
    init(); // reinject the script
  };

  document.getElementById('reinject')?.addEventListener('click', reInject);

  document
    .getElementById('print')
    ?.addEventListener('click', () => getOrders(false, false));

  document
    .getElementById('print-student')
    ?.addEventListener('click', () => getOrders(true, false));

  document
    .getElementById('print-student-seperate')
    ?.addEventListener('click', () => getOrders(true, true));

  intervalButtons = setInterval(() => {
    const checkBoxElement = document.querySelector(
      '.list-toolbar-head .next-checkbox-input',
    ) as HTMLElement;
    const printElem = document.getElementById('print') as HTMLButtonElement;
    const printBillElem = document.getElementById(
      'print-student',
    ) as HTMLButtonElement;
    const printSeperateElem = document.getElementById(
      'print-student-seperate',
    ) as HTMLButtonElement;
    if (
      checkBoxElement &&
      checkBoxElement.attributes['aria-checked'] &&
      printElem &&
      printBillElem &&
      printSeperateElem
    ) {
      if (
        checkBoxElement.attributes['aria-checked'].value === 'true' ||
        checkBoxElement.attributes['aria-checked'].value === 'mixed'
      ) {
        if (printElem && printBillElem) {
          printElem.disabled = false;
          printBillElem.disabled = false;
          printSeperateElem.disabled = false;
        }
      } else {
        printElem.disabled = true;
        printBillElem.disabled = true;
        printSeperateElem.disabled = true;
      }
    }
  }, 200);
};
init();

const getOrders = async (bill: boolean, splitDoc: boolean) => {
  const ordersElem = document.querySelectorAll('div.list-item-header');

  const filteredInputChecked = [...ordersElem].filter(
    (z) =>
      z.querySelector('input')?.attributes['aria-checked']?.value === 'true',
  ) as HTMLElement[];
  const orderIds: string[] = filteredInputChecked.flatMap(
    (z) => z.querySelector('.order-field-value a')?.textContent ?? '',
  );
  console.log(orderIds, filteredInputChecked);

  try {
    const ordersResults: LazadaOrder[] = []; //pararell will cause bot detect
    for (const orderId of orderIds) {
      const orderResult = await lazadaAPI.getOrders(orderId);
      ordersResults.push(orderResult);
    }

    const printLabelPromises = ordersResults.map((x, xid) => {
      const orderId = x.data.data[0].orderNumber;
      const tradeOrderLineIds = x.data.data[6].dataSource
        ?.filter((x) => x.status !== 'canceled')
        .map(
          // tradeOrderLineIds are each item id in the order
          (x) => x.orderLineId,
        );
      return {
        orderId,
        orderItemIds: tradeOrderLineIds,
      };
      // return lazadaAPI.getPrintLabel(
      //   orderId as string,
      //   tradeOrderLineIds as string[],
      // );
    });

    const printLabelResults = await lazadaAPI.getPrintMultipleLabels(
      printLabelPromises,
    );
    console.log(printLabelResults);
    if (splitDoc) {
      GenStudentBillSeperate(ordersResults, printLabelResults, bill);
    } else {
      GenStudentBill(ordersResults, printLabelResults, bill);
    }
  } catch (e: any) {
    console.log(e.url);
    // alert('ERROR TRY AGAIN');
    const url = e.url as string;

    window.open(url, '_blank')?.focus();
  }
};

const initHead = async () => {
  const pageTitle = await utils.waitForElement('.page-title');
  pageTitle.insertAdjacentHTML(
    'afterend',
    '<button id="reinject">Debug</button><div id="snackbar">Some text some message..</div>',
  );
};

initHead();
