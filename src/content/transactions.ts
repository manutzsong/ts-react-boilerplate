import dayjs from 'dayjs';
import { DataSourceTransactions } from '../pages/types/LazadaTransactions';
import lazadaAPI from '../utils/lazadaAPI';

const roundToTwo = (num: number) => {
  return Math.round(num * 100 + Number.EPSILON) / 100;
};

const init = async () => {
  const yearlyData = await lazadaAPI.getTransactionYearlySummary();

  // create htmlTable of yearlyData and show DataSourceTransactions array
  const htmlTable = yearlyData
    .map((yearlyDataItem) => {
      const {
        year,
        total,
        lazadaFees,
        lazadaMarketingFees,
        dataSourceTransactions,
      } = yearlyDataItem;
      const htmlTableRow = `
        <tr class="next-table-row">
            <td class="next-table-cell">${year}</td>
            <td class="next-table-cell">${roundToTwo(
              total,
            ).toLocaleString()}</td>
            <td class="next-table-cell">${roundToTwo(
              lazadaFees,
            ).toLocaleString()}</td>
            <td class="next-table-cell">${roundToTwo(
              lazadaMarketingFees,
            ).toLocaleString()}</td>
        </tr>
    `;
      return htmlTableRow;
    })
    .join('');

  document
    .querySelector('div.next-tabs-content .payout-overview-wrap')
    ?.insertAdjacentHTML(
      'afterend',
      `
    <div class="ui-item label-hoc hoc-label-top statement-list-wrap CommonContainer">
        <div class="dada-common-container statement-list-wrap">
            <div class="next-table alist-recursion-table">
            <table>
                <thead class="next-table-header">
                    <tr>
                        <th rowspan="1" type="header" class="next-table-cell next-table-header-node" role="gridcell"><div class="next-table-cell-wrapper">ปี</div></th>
                        <th rowspan="1" type="header" class="next-table-cell next-table-header-node" role="gridcell"><div class="next-table-cell-wrapper">รายรับ</div></th>
                        <th rowspan="1" type="header" class="next-table-cell next-table-header-node" role="gridcell"><div class="next-table-cell-wrapper">Lazada Fees</div></th>
                        <th rowspan="1" type="header" class="next-table-cell next-table-header-node" role="gridcell"><div class="next-table-cell-wrapper">Lazada Marketing Fees</div></th>
                    </tr>
                </thead>
                <tbody class="next-table-body">
                    ${htmlTable}
                </tbody>
            </table>
            </div>
        </div>
    </div>`,
    );
};
init();
