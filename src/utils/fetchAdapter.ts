const fetchGetAdapt = (url: string) => {
  //make request to URL [GET]
  return new Promise((resolve) => {
    fetch(url, {
      headers: {
        accept: 'application/json',
        'accept-language': 'en,th-TH;q=0.9,th;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        pragma: 'no-cache',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
      referrer: 'https://sellercenter.lazada.co.th/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) return response.json()
      })
      .then((json) => {
        resolve(json)
      })
  })
}

const fetchPostAdapter = (url: string, data: any) => {
  return new Promise((resolve) => {
    fetch(url, {
      headers: {
        accept: 'application/json',
        'accept-language': 'en,th-TH;q=0.9,th;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
      referrer: 'https://sellercenter.lazada.co.th/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `data=${JSON.stringify(data)}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) return response.json()
      })
      .then((json) => {
        resolve(json)
      })
  })
}

export default { fetchGetAdapt, fetchPostAdapter }
