/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import lazadaAPI from '../utils/lazadaAPI';
import GenStudentBill from '../utils/genStudentBill';
import { LazadaOrder } from '../pages/types/LazadaOrderType';
import { LaqoliLocalStorage } from '../pages/types/LaqoliLocalStorage';
import { LaqoliSyncSettings } from '../pages/types/LaqoliSyncSettings';
import utils from '../utils/utils';

const init = async () => {
  const addressRes = await lazadaAPI.getAddress();
  console.log(addressRes);

  const toolbarContainer = await utils.waitForElement('div.toolbar-container');
  /* manipulate add button */
  toolbarContainer.insertAdjacentHTML(
    'afterbegin',
    `
    <div>
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
    const checkBoxElement = document.querySelector("div.next-table-cell-wrapper .next-checkbox-input") as HTMLElement;
    const printElem = document.getElementById("print") as HTMLButtonElement;
    const printBillElem = document.getElementById("print-student") as HTMLButtonElement;
    if (checkBoxElement && checkBoxElement.attributes["aria-checked"]) {
      if (checkBoxElement.attributes["aria-checked"].value === "true" || checkBoxElement.attributes["aria-checked"].value === "mixed") {
        if (printElem && printBillElem) {
          printElem.disabled = false;
          printBillElem.disabled = false;
        }
      }
      else {
        printElem.disabled = true;
          printBillElem.disabled = true;
      }
    }
  }, 200);
};
init();

const getOrders = async (bill: boolean) => {
  const aElements = document.querySelectorAll('a');
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
      );

    const orderIds = orders.flatMap((a) => a.textContent ?? '');
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
  }
};
