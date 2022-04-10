/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import lazadaAPI from '../utils/lazadaAPI';
import GenStudentBill from '../utils/genStudentBill';
import { LazadaOrder } from '../pages/types/LazadaOrderType';
import utils from '../utils/utils';
import zIndex from '@mui/material/styles/zIndex';

const init = async () => {
  const addressRes = await lazadaAPI.getAddress();
  console.log(addressRes);

  const toolbarContainer = await utils.waitForElement(
    '.list-toolbar .order-toolbar-actions .order-toolbar-actions-left',
  );
  /* manipulate add button */
  toolbarContainer.insertAdjacentHTML(
    'afterbegin',
    `
    <div style="padding-right: 1rem;">
      <button class="next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp" id="print">Print Dropoff</button>
        <button class="next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp" id="print-student">Print Dropoff + ใบเสร็จ</button>
    </div>
  `,
  );
  document
    .getElementById('print')
    ?.addEventListener('click', () => getOrders(false));

  document
    .getElementById('print-student')
    ?.addEventListener('click', () => getOrders(true));

  setInterval(() => {
    const checkBoxElement = document.querySelector(
      '.list-toolbar-head .next-checkbox-input',
    ) as HTMLElement;
    const printElem = document.getElementById('print') as HTMLButtonElement;
    const printBillElem = document.getElementById(
      'print-student',
    ) as HTMLButtonElement;
    if (checkBoxElement && checkBoxElement.attributes['aria-checked']) {
      if (
        checkBoxElement.attributes['aria-checked'].value === 'true' ||
        checkBoxElement.attributes['aria-checked'].value === 'mixed'
      ) {
        if (printElem && printBillElem) {
          printElem.disabled = false;
          printBillElem.disabled = false;
        }
      } else {
        printElem.disabled = true;
        printBillElem.disabled = true;
      }
    }
  }, 200);
};
init();

const getOrders = async (bill: boolean) => {
  const ordersElem = document.querySelectorAll('div.list-item-header');
  const filteredInputChecked = [...ordersElem].filter(
    (z) =>
      z.querySelector('input')?.attributes['aria-checked']?.value === 'true',
  ) as HTMLElement[];
  const orderIds:string[] = filteredInputChecked.flatMap(
    (z) => z.querySelector(".order-field-value a")?.textContent ?? "",
  );
  console.log(orderIds, filteredInputChecked);

  const orderIdsPromises = orderIds.map((orderId) =>
    lazadaAPI.getOrders(orderId),
  );
  const ordersResults: LazadaOrder[] = await Promise.all(orderIdsPromises);

  const printLabelPromises = ordersResults.map((x) => {
    const orderId = x.data.data[0].orderNumber;
    const tradeOrderLineIds = x.data.data[6].dataSource?.map(
      // tradeOrderLineIds are each item id in the order
      (x) => x.orderLineId,
    );
    return lazadaAPI.getPrintLabel(
      orderId as string,
      tradeOrderLineIds as string[],
    );
  });

  const printLabelResults = await Promise.all(printLabelPromises);
  console.log(printLabelResults);

  GenStudentBill(ordersResults, printLabelResults, bill);
};
