import { TiktokOrderType } from '../pages/types/TiktokOrderType';

const getOrderById = async (id: string): Promise<TiktokOrderType> => {
  const res = await fetch(
    `https://seller-th.tiktok.com/api/v2/trade/orders/get?locale=th-TH&language=th-TH&main_order_id=${id}&version=2`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-tt-oec-region': 'TH',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );
  const resJSON = res.json();
  return new Promise((resolve) => resolve(resJSON));
};

export default {
    getOrderById,
}