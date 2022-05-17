import GetShoppeeStudentBill from '../utils/genShopeeOnlyCashBill';
import utils from '../utils/utils';
import shopeeAPI from '../utils/shopeeAPI';

const init = async () => {
  const creationDiv = await utils.waitForElement(
    '.document-method-select-container.container button',
  );
  console.log(creationDiv);
  if (creationDiv) {
    creationDiv.insertAdjacentHTML(
      'afterend',
      `<div>
        <button type="button" class="search-btn shopee-button shopee-button--primary shopee-button--normal" id="print-bill">Print Bill</button>
        </button>
        
        </div>`,
    );

    document.querySelector('div.content-box')?.insertAdjacentHTML(
      'afterend',
      `<button type="button" class="search-btn shopee-button shopee-button--primary shopee-button--normal" id="debug-print">Debug</button>
    </button>`,
    );

    document
      .getElementById('print-bill')
      ?.addEventListener('click', getCheckboxes);

    document
      .getElementById('debug-print')
      ?.addEventListener('click', getOrderTbody);
  }
};

const getOrderTbody = async () => {
  // document.querySelectorAll("tbody div.order-sn")[1].textContent.trim()
  const orderIds = [...document.querySelectorAll('tbody div.order-sn')].flatMap(
    (x) => x?.textContent?.trim(),
  );
  console.log(orderIds);
  const promisesOrderSN = await Promise.all(
    orderIds.map((x) => shopeeAPI.getOrderRealId(x as string)),
  );

  const realOrderId = promisesOrderSN.map((x) => x.data.order_sn_result.list[0].order_id.toString());

  const promisesOrder = await Promise.all(
    realOrderId.map((x) => shopeeAPI.getOrder(x)),
  );

  GetShoppeeStudentBill(promisesOrder);
};

const getCheckboxes = async () => {
  const checkboxes = document.querySelectorAll(
    '.order-list-table-body .table-td.checkbox input',
  );
  if (checkboxes) {
    const checkboxArray = Array.from(checkboxes) as HTMLInputElement[];
    const filteredCheckboxes = checkboxArray.filter((x) => x.checked);
    const orderIds = filteredCheckboxes.flatMap((x) =>
      x?.parentElement?.parentElement?.parentElement?.parentElement
        ?.querySelector('a')
        ?.href.replace('https://seller.shopee.co.th/portal/sale/order/', ''),
    ) as string[];
    console.log(orderIds);
    const promisesOrder = await Promise.all(
      orderIds.map((x) => shopeeAPI.getOrder(x)),
    );
    GetShoppeeStudentBill(promisesOrder);
  }
};

init();
// const test = async() => {
//   const res = await shopeeAPI.getOrder("103535223272839");
//   console.log(res);
//   GetShoppeeStudentBill([res]);
// }
// test();
