import APICallString from './signKey';
import fetchAdapter from './fetchAdapter';
import { LazadaOrder } from '../pages/types/LazadaOrderType';
import { LazadaPrintLabel } from '../pages/types/LazadaPrintLabel';
import { LazadaAddressType } from '../pages/types/LazadaAddressType';
import { LazadaShopInfoType } from '../pages/types/LazadaShopInfoType';
import { LazadaOrderFind } from '../pages/types/LazadaOrderFind';
import {
  DataSourceTransactions,
  LazadaTransactions,
} from '../pages/types/LazadaTransactions';
import dayjs from 'dayjs';
import { LaqoliYearlyTransactionsData } from '../pages/types/LaqoliYearlyTransactionsData';
import { LazadaShopPhoneType } from '../pages/types/LazadaShopPhoneType';
import { LazadaMultiplePrintLabels } from '../pages/types/LazadaMultiplePrintLabels';

const getOrders = async (orderID: string): Promise<LazadaOrder> => {
  const data = {
    _timezone: -7,
    tradeOrderId: orderID,
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.query.detail/1.0/?jsv=2.3.16&appKey=4272&t=1620042606731&sign=0966d19a2bce55bc8f957b5f49f577aa&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.query.detail&type=originaljson&method=GET&api=mtop.lazada.seller.order.query.detail&headers=%5Bobject%20Object%5D&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22_timezone%22%3A-7%2C%22spm%22%3A%22a1zawg.20980230.order_table_0.1.21ac4edfymPXAz%22%2C%22tradeOrderId%22%3A%22387476782740391%22%7D',
    data,
    '4272',
  );
  try {
    const resultAPI = (await fetchAdapter.fetchGetAdapt(resultAPICall)) as any;
    if (resultAPI) {
      if (resultAPI.ret[0] === 'FAIL_SYS_USER_VALIDATE') {
        throw {
          message: 'FAIL_SYS_USER_VALIDATE',
          url: resultAPI.data.url,
        };
      } else {
        return new Promise((resolve) => resolve(resultAPI as LazadaOrder));
      }
    } else {
      throw { message: 'FAIL NETWORK' };
    }
  } catch (e) {
    return new Promise((_resolve, reject) => reject(e));
  }
};

const getAddress = async (): Promise<LazadaAddressType> => {
  const data = {
    groupId: 2,
  };

  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.global.merchant.subaccount.profile.render.lazada/1.0/?jsv=2.6.1&appKey=4272&t=1649514401610&sign=698137d28ebe21bf70934b197d7234f2&v=1.0&timeout=30000&H5Request=true&url=mtop.global.merchant.subaccount.profile.render.lazada&params=%5Bobject%20Object%5D&api=mtop.global.merchant.subaccount.profile.render.lazada&type=originaljson&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22groupId%22%3A2%2C%22spm%22%3A%22a1zawg.26007879.configs.d_business.37ac4edfpUj6jW%22%7D',
    data,
    '4272',
  );
  const resultAPI = await fetchAdapter.fetchGetAdapt(resultAPICall);
  return new Promise((resolve) => resolve(resultAPI as LazadaAddressType));
};

const getShopInfo = async (): Promise<LazadaShopInfoType> => {
  const data = {
    spm: 'a1zawg.17649215.navi_left_sidebar.droot_normal_myaccount_settings.683e4edfqvx9a1',
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.global.merchant.subaccount.otp.userinfo/1.0/?jsv=2.6.1&appKey=4272&t=1649516612791&sign=d58a287a123a2ae6ab19686c663003aa&v=1.0&timeout=30000&H5Request=true&url=mtop.global.merchant.subaccount.otp.userinfo&api=mtop.global.merchant.subaccount.otp.userinfo&type=originaljson&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22spm%22%3A%22a1zawg.17649215.navi_left_sidebar.droot_normal_myaccount_settings.683e4edfqvx9a1%22%7D',
    data,
    '4272',
  );
  const resultAPI = await fetchAdapter.fetchGetAdapt(resultAPICall);
  return new Promise((resolve) => resolve(resultAPI as LazadaShopInfoType));
};
const getShopPhone = async (): Promise<LazadaShopPhoneType> => {
  const data = {
    groupId: 1,
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.global.merchant.subaccount.profile.render.lazada/1.0/?jsv=2.6.1&appKey=4272&t=1650347137909&sign=49af15c193d1db9a77126508ad2d2f06&v=1.0&timeout=30000&H5Request=true&url=mtop.global.merchant.subaccount.profile.render.lazada&params=%5Bobject%20Object%5D&api=mtop.global.merchant.subaccount.profile.render.lazada&type=originaljson&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22groupId%22%3A1%2C%22spm%22%3A%22a1zawg.26007879.configs.d_seller.74004edfLqJiK4%22%7D',
    data,
    '4272',
  );
  const resultAPI = await fetchAdapter.fetchGetAdapt(resultAPICall);
  return new Promise((resolve) => resolve(resultAPI as LazadaShopPhoneType));
};

const getPrintLabel = async (
  orderID: string,
  orderItemIds: string[],
): Promise<string> => {
  const data = {
    _timezone: -7,
    processRequest: JSON.stringify({
      orders: [{ orderId: orderID, orderItemIds: orderItemIds }],
      types: ['awb'],
      source: 'completeHtmlAwb',
    }),
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.package.print/1.0/?jsv=2.6.1&appKey=4272&t=1649429102708&sign=8ba95bf3acafeab5fc5ca3be358b6a80&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.package.print&type=originaljson&method=POST&noUrlQuery=true&api=mtop.lazada.seller.order.package.print&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH',
    data,
    '4272',
  );
  const resultAPI: LazadaPrintLabel = (await fetchAdapter.fetchPostAdapter(
    resultAPICall,
    data,
  )) as LazadaPrintLabel;

  return new Promise((resolve) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      resultAPI.data.data[0].eventParams.patchs[0].pages[0],
      'text/html',
    );
    const printLabel = htmlDoc.documentElement.querySelector('img')?.src;
    resolve(printLabel ?? '');
  });
};

const getPrintMultipleLabels = async (
  orders: {
    orderId: string;
    orderItemIds: string[];
  }[],
): Promise<string[]> => {
  const data = {
    _timezone: -7,
    processRequest: JSON.stringify({
      orders: orders,
      types: ['awb'],
      source: 'completeHtmlAwb',
    }),
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.package.print/1.0/?jsv=2.6.1&appKey=4272&t=1649429102708&sign=8ba95bf3acafeab5fc5ca3be358b6a80&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.package.print&type=originaljson&method=POST&noUrlQuery=true&api=mtop.lazada.seller.order.package.print&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH',
    data,
    '4272',
  );
  const resultAPI: LazadaMultiplePrintLabels =
    (await fetchAdapter.fetchPostAdapter(
      resultAPICall,
      data,
    )) as LazadaMultiplePrintLabels;

  return new Promise((resolve) => {
    const parser = new DOMParser();
    // const htmlDoc = parser.parseFromString(
    //   resultAPI.data.data[0].eventParams.patchs[0].pages[0],
    //   'text/html',
    // );

    const printLabels = [] as string[];
    for (
      let i = 0;
      i < resultAPI.data.data[0].eventParams.patchs[0].pages.length;
      i += 1
    ) {
      const htmlHere = parser.parseFromString(
        resultAPI.data.data[0].eventParams.patchs[0].pages[i],
        'text/html',
      );
      const printLabelHere = htmlHere.documentElement.querySelector('img')?.src;
      if (printLabelHere) {
        printLabels.push(printLabelHere);
      } else {
        throw new Error('No print label found');
      }
    }
    // const printLabel = htmlDoc.documentElement.querySelector('img')?.src;
    resolve(printLabels);
  });
};

const getOrderByOrderId = async (orderId: string): Promise<LazadaOrderFind> => {
  const data = {
    _timezone: -7,
    page: 1,
    pageSize: 80,
    orderNumbers: orderId,
    filterOrderItems: true,
    sort: 'GMT_CREATE',
    sortOrder: 'DESC',
    tab: 'all',
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.seller.order.query.list/1.0/?jsv=2.6.1&appKey=4272&t=1649569829092&sign=65b6e3b465addb3daa728ed94e20ca67&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.seller.order.query.list&type=originaljson&method=GET&noUrlQuery=true&api=mtop.lazada.seller.order.query.list&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22_timezone%22%3A-7%2C%22page%22%3A1%2C%22pageSize%22%3A80%2C%22orderNumbers%22%3A%22529002334840819%22%2C%22filterOrderItems%22%3Atrue%2C%22sort%22%3A%22GMT_CREATE%22%2C%22sortOrder%22%3A%22DESC%22%2C%22tab%22%3A%22all%22%7D',
    data,
    '4272',
  );
  const resultAPI = await fetchAdapter.fetchGetAdapt(resultAPICall);
  return new Promise((resolve) => resolve(resultAPI as LazadaOrderFind));
};

const getTransaction = async (): Promise<DataSourceTransactions[]> => {
  const pageSize = 10;
  const data = {
    _timezone: -7,
    tab: '0',
    pageSize: 10,
    currentPage: 1,
  };
  const resultAPICall = APICallString(
    'https://acs-m.lazada.co.th/h5/mtop.lazada.finance.sellerfund.statementlist.query/1.0/?jsv=2.6.1&appKey=4272&t=1649588898211&sign=5d20bfbe68a69c2edee9bc71b911cae4&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.finance.sellerfund.statementlist.query&type=originaljson&method=GET&api=mtop.lazada.finance.sellerfund.statementlist.query&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22_timezone%22%3A-7%2C%22spm%22%3A%22a1zawg.17752401.navi_left_sidebar.droot_normal_finance_accountstatementnew.41694edfOiL96V%22%2C%22tab%22%3A%220%22%2C%22pageSize%22%3A100%2C%22currentPage%22%3A1%7D',
    data,
    '4272',
  );
  const resultAPI = (await fetchAdapter.fetchGetAdapt(
    resultAPICall,
  )) as LazadaTransactions;
  // loop for all page
  const numberOfPage = Math.ceil(resultAPI.data.data.pageInfo.total / 50);
  const transactions: LazadaTransactions[] = [];
  for (let i = 1; i <= numberOfPage; i += 1) {
    const dataLoop = {
      _timezone: -7,
      tab: '0',
      pageSize: 50,
      currentPage: i,
    };
    const resultAPICallLoop = APICallString(
      'https://acs-m.lazada.co.th/h5/mtop.lazada.finance.sellerfund.statementlist.query/1.0/?jsv=2.6.1&appKey=4272&t=1649588898211&sign=5d20bfbe68a69c2edee9bc71b911cae4&v=1.0&timeout=30000&H5Request=true&url=mtop.lazada.finance.sellerfund.statementlist.query&type=originaljson&method=GET&api=mtop.lazada.finance.sellerfund.statementlist.query&dataType=json&valueType=original&x-i18n-regionID=LAZADA_TH&data=%7B%22_timezone%22%3A-7%2C%22spm%22%3A%22a1zawg.17752401.navi_left_sidebar.droot_normal_finance_accountstatementnew.41694edfOiL96V%22%2C%22tab%22%3A%220%22%2C%22pageSize%22%3A100%2C%22currentPage%22%3A1%7D',
      dataLoop,
      '4272',
    );
    const resultAPILoop = (await fetchAdapter.fetchGetAdapt(
      resultAPICallLoop,
    )) as LazadaTransactions;
    transactions.push(resultAPILoop);
  }

  const dataSourceTransactions = transactions.flatMap(
    (transaction) => transaction.data.data.dataSource,
  );
  return new Promise((resolve) => resolve(dataSourceTransactions));
};

const getTransactionYearlySummary = async (): Promise<
  LaqoliYearlyTransactionsData[]
> => {
  const transactions: DataSourceTransactions[] = await getTransaction();
  console.log(transactions);

  const yearlyData: LaqoliYearlyTransactionsData[] = [];

  for (let i = 0; i < 10; i += 1) {
    // only 10 years back
    const endDate = dayjs().endOf('year').subtract(i, 'year');

    const yearlyDataItem: DataSourceTransactions[] = transactions.filter(
      (transaction) => {
        const transactionYear = dayjs.unix(transaction.endDate / 1000);
        const isSameYear = transactionYear.isSame(endDate, 'year');
        return isSameYear;
      },
    );
    let lazadaFees = 0;
    let lazadaMarketingFees = 0;
    let total = 0;
    for (const transaction of yearlyDataItem) {
      lazadaFees +=
        transaction.amountType.find((x) => x.name === 'ค่าธรรมเนียมจากลาซาด้า')
          ?.amountDecimal ?? 0;
      lazadaMarketingFees +=
        transaction.amountType.find((x) => x.name === 'ค่าธรรมเนียมด้านการตลาด')
          ?.amountDecimal ?? 0;
      total += parseFloat(transaction.totalPayout.replace(/,/g, ''));
    }

    yearlyData.push({
      year: parseInt(endDate.format('YYYY')),
      total: total,
      lazadaFees: lazadaFees,
      lazadaMarketingFees: lazadaMarketingFees,
      dataSourceTransactions: yearlyDataItem,
    });
    // console.log(yearlyDataItem);
  }
  console.log(yearlyData);
  return new Promise((resolve) => resolve(yearlyData));
};

export default {
  getOrders,
  getPrintLabel,
  getAddress,
  getShopInfo,
  getOrderByOrderId,
  getTransaction,
  getTransactionYearlySummary,
  getShopPhone,
  getPrintMultipleLabels,
};
