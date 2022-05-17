import { ShopeeReviewType } from '../pages/types/ShopeeReviewType';

const init = async () => {
  const firstRes = await fetch(
    'https://seller.shopee.co.th/api/v3/settings/search_shop_rating_comments/?replied=false&rating_star=5&page_number=1&page_size=20&cursor=0&from_page_number=1',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sc-fe-session': 'b12d5619-e5dd-4244-9632-a156bf775a00',
        'sc-fe-ver': '50139',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrer:
        'https://seller.shopee.co.th/portal/settings/shop/rating?category=5&replied=1',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );
  const firstResJson: ShopeeReviewType = await firstRes.json();
  const totalWaitReview = firstResJson.data.page_info.total;
  //   const totalWaitReview = 100;
  let cursor =
    firstResJson.data.list[firstResJson.data.list.length - 1].comment_id;

  const times = Math.ceil(totalWaitReview / 20);
  for (let i = 1; i <= times; i += 1) {
    const res = await fetch(
      `https://seller.shopee.co.th/api/v3/settings/search_shop_rating_comments/?replied=false&rating_star=5&page_number=${
        i + 1
      }&page_size=20&cursor=${cursor}&from_page_number=${i}`,
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sc-fe-session': 'b12d5619-e5dd-4244-9632-a156bf775a00',
          'sc-fe-ver': '50139',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        referrer:
          'https://seller.shopee.co.th/portal/settings/shop/rating?category=5&replied=1',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      },
    );
    const resJson: ShopeeReviewType = await res.json();
    cursor = resJson.data.list[resJson.data.list.length - 1].comment_id;
    console.log(resJson.data.list);
    for (let x = 0; x < resJson.data.list.length; x += 1) {
      replyComment(
        resJson.data.list[x].order_id,
        resJson.data.list[x].comment_id,
      ); // no need to await we don't care
    }
  }
};

const replyComment = async (
  orderId: number,
  commentId: number,
): Promise<void> => {
  fetch('https://seller.shopee.co.th/api/v3/settings/reply_shop_rating/', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=UTF-8',
      pragma: 'no-cache',
      'sc-fe-session': 'b88a8fcb-8167-48f3-9773-ccca07274ab3',
      'sc-fe-ver': '50139',
      'sec-ch-ua':
        '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    referrer:
      'https://seller.shopee.co.th/portal/settings/shop/rating?category=5&replied=1',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify({
      order_id: orderId,
      comment_id: commentId,
      comment:
        'SN-School ขอบพระคุณสำหรับการรีวิวผลิตภัณฑ์และการบริการในครั้งนี้ \n เราจำหน่ายชุดนักเรียน กระโปรงทรงแคบ และ สินค้าอื่นๆ คุณภาพดีราคาย่อมเยา พร้อมบริการจากใจ\nและเพื่อไม่ให้ลูกค้าคนพิเศษพลาดโปรโมชั่นและส่วนลดที่คุ้มค่า \nอย่าลืมกดติดตามร้านค้า SN-School ของเราด้วยนะคะ',
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
  console.log(`orderId: ${orderId} commentId: ${commentId}`);
  return new Promise((resolve) => resolve());
};
