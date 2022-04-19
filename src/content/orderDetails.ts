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
    //[...document.querySelectorAll("input.laqoli-checkbox")].filter(x => x.checked)[0].parentElement.parentElement.parentElement.children[2].textContent
  }
};
init();
