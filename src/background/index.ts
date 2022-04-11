
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  const tabId = details.tabId;
  const currentUrl = details.url;
  // checkURL(currentUrl, tabId);
  const url = new URL(currentUrl);
  // if (url.hostname === 'https://sellercenter.lazada.co.th') {

  // }
  chrome.tabs.sendMessage(tabId, {
    message: 'hello!',
    details,
    url,
  });
});

// const checkURL = (urlArg: string, tabId: number) => {
//   console.log(urlArg);
//   const url = new URL(urlArg);
//   console.log(url.pathname);
//   switch (url.pathname) {
//     case '/apps/order/list':
//       injectScript(tabId, 'content/newestPrint.js');
//       break;
//     default:
//       break;
//   }

// }


// const injectScript = (tabId: number, fileName: string) => {
//   console.log("INJECTED :" + fileName);
//   chrome.tabs.executeScript(tabId, {
//     file: fileName
//   });
// }
