import GenCashBill from '../utils/genOnlyCashBill';
import lazadaAPI from '../utils/lazadaAPI';
import utils from '../utils/utils';

const init = async () => {
  const sectionBox = await utils.waitForElement('.next-box.section-box');
  const orderIdElement = await utils.waitForElement(
    'span.order-detail-title-number',
  );
  const orderHeader = (await utils.waitForElement(
    'div.next-card-header-title',
  )) as HTMLElement;
  const orderId = orderIdElement.textContent?.split(' ')[1];
  const orderResult = await lazadaAPI.getOrderByOrderId(orderId ?? '');
  /* manipulate add button */
  if (orderResult.data.data.pageInfo.total > 0) {
    const htmlDiv = `
    <div class="section-field">
      <div class="section-field-label">ประเภทคำสั่งซื้อ (Laqoli)</div>
      <div class="section-field-value">${orderResult.data.data.dataSource[0].paymentMethod}</div>
    </div>
    `;
    sectionBox.insertAdjacentHTML('beforeend', htmlDiv);

    /* append chat button */

    // const divAppend = document.createElement("a");
    // divAppend.className = "d-flex";
    // divAppend.style.alignItems = "center";
    // divAppend.innerHTML = `<div style="padding-right: 0.5rem;"><p style="padding: 0;margin: 0;">แชทกับลูกค้า</p></div>
    // <span class="icon-open-chat icon-asc-order icon-asc-order-chat"></span>`;

    // sectionBox.children[0].children[1].append(divAppend);
    orderHeader.className = 'next-card-header-title d-flex';
    orderHeader.style.alignItems = 'center';
    orderHeader.style.justifyContent = 'space-between';
    const divAppend = document.createElement('a');
    divAppend.innerHTML = `
    <div class="order-header-chat-box">
        <a 
            href="${orderResult.data.data.dataSource[0].imChatLink}" 
            target="_blank" data-spm="d_chat_button" 
            aria-haspopup="true" 
            aria-expanded="false" 
            class="next-btn next-medium next-btn-primary next-btn-text chat-button aplus-auto-exp">
                <img 
                    class="user-avatar" 
                    src="https://img.alicdn.com/imgextra/i2/O1CN01r8YtY0214uDzCoqLj_!!6000000006932-2-tps-120-120.png">
                        <span class="next-btn-helper">
                        แชทกับลูกค้า</span>
                        <span class="icon-open-chat icon-asc-order icon-asc-order-chat">
                    </span>
        </a>
    </div>
`;
    orderHeader.append(divAppend);

    /* append checkbox */
    const tbody = document.querySelectorAll('tbody tr');
    if (tbody) {
      document
        .querySelector('[data-spm="item_list_panel"] .next-card-header-titles')
        ?.insertAdjacentHTML(
          'afterend',
          "<button class='next-btn next-medium next-btn-primary aplus-auto-clk aplus-auto-exp' id='print-laqoli'>PRINT (Laqoli)</button>",
        ); //append button
      [...tbody].forEach((item) => {
        if (
          item &&
          item.firstElementChild &&
          item.firstElementChild.firstElementChild
        ) {
          item.firstElementChild.firstElementChild.innerHTML =
            '<input type="checkbox" class="laqoli-checkbox"/>';
        }
      });
    }
    document
      .getElementById('print-laqoli')
      ?.addEventListener('click', getItemId);
  }
};

const getItemId = async () => {
  const checkBoxes = document.querySelectorAll('input.laqoli-checkbox');
  if (checkBoxes) {
    const checkBoxesElement = [...checkBoxes] as HTMLInputElement[];
    const filteredCheckBoxes = checkBoxesElement
      .filter((x) => x.checked)
      .flatMap(
        (x) =>
          x?.parentElement?.parentElement?.parentElement?.children[2]
            ?.textContent,
      );
    console.log(filteredCheckBoxes);
    if (filteredCheckBoxes.length > 0) {
      printLaqoli(filteredCheckBoxes as string[]);
    }
  }
};

const printLaqoli = async (itemId: string[]) => {
  const orderId = document
    .querySelector('.order-detail-title-number')
    ?.textContent?.split(' ')[1];
  if (orderId) {
    const order = await lazadaAPI.getOrders(orderId);
    const orderResult = order.data.data;
    const itemList = orderResult[6].dataSource;
    const filteredItemList = itemList.filter((x) =>
      itemId.includes(x.orderLineId),
    );
    console.log(filteredItemList);
    console.log(orderResult);
    GenCashBill(order, filteredItemList);
  }
};
init();
