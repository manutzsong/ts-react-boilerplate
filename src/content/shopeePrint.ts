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

    document
      .getElementById('print-bill')
      ?.addEventListener('click', getCheckboxes);
  }
};

const getCheckboxes = async() => {
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
