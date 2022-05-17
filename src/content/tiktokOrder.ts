// [...document.querySelectorAll("td input[type='checkbox']")].filter(x => x.checked)[0].parentElement.parentElement.parentElement.nextElementSibling.querySelector("a").textContent

import GetTiktokStudentBill from '../utils/genTiktokStudentBill';
import tiktokAPI from '../utils/tiktokAPI';
import utils from '../utils/utils';

const init = async () => {
  const groupButtons = await utils.waitForElement('.arco-btn.arco-btn-primary');
  document.querySelector("h1.font-bold.text-3xl.m-0")?.insertAdjacentHTML(
    'afterend',
    "<button id='printbill'>Print Bill</button>",
  );

  document.getElementById("printbill")?.addEventListener('click', printBill);
};

const printBill = async () => {
  const elems = [...document.querySelectorAll("td input[type='checkbox']")];
  const elemsHTMLInputs = elems  as HTMLInputElement[];
  const checkedElems = elemsHTMLInputs.filter((x) => x.checked);
  const orderIds = checkedElems.flatMap(
    (x) =>
      x?.parentElement?.parentElement?.parentElement?.nextElementSibling?.querySelector(
        'a',
      )?.textContent,
  );
  console.log(orderIds);
  if (orderIds.length > 0) {
    const promiseOrders = orderIds.map((x) =>
      tiktokAPI.getOrderById(x as string),
    );
    const orders = await Promise.all(promiseOrders);
    GetTiktokStudentBill(orders);
  }
};

init();