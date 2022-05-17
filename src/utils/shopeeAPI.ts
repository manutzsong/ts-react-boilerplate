import { ShopeeFindOrder } from '../pages/types/ShopeeFindOrder';
import { ShopeeOrderType } from '../pages/types/ShopeeOrderType';
import { ShopeeShopAddress } from '../pages/types/ShopeeShopAddress';
import { ShopeeShopInfo } from '../pages/types/ShopeeShopInfo';

const getOrder = async (orderId: string): Promise<ShopeeOrderType> => {
  const res = await fetch(
    `https://seller.shopee.co.th/api/v3/order/get_one_order?&SPC_CDS_VER=2&order_id=${orderId}`,
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );

  const order = await res.json();
  return order;
};

const getAddress = async (): Promise<ShopeeShopAddress> => {
  const res = await fetch(
    'https://seller.shopee.co.th/api/v3/settings/get_address',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );

  const order = await res.json();
  return order;
};

const getOrderRealId = async (orderSN:string):Promise<ShopeeFindOrder> => {
  const res = await fetch(
    `https://seller.shopee.co.th/api/v3/order/search_order_hint?&keyword=${orderSN}&category=1&list_type=toship`,
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );
  const resJSON = res.json();
  return new Promise((resolve) => resolve(resJSON));
};

const getShopInfo = async (): Promise<ShopeeShopInfo> => {
  const res = await fetch(
    'https://seller.shopee.co.th/api/v3/general/get_shop',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );

  const order = await res.json();
  return order;
};

const getShopLogo = async (): Promise<string> => {
  const res = await fetch(
    'https://seller.shopee.co.th/api/v2/login/?SPC_CDS_VER=2',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );

  const order = await res.json();
  console.log(order);
  return `https://cf.shopee.co.th/file/${order.portrait}`;
};

export default { getOrder, getShopInfo, getAddress, getShopLogo, getOrderRealId };
