chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (details) {
    chrome.tabs.onActivated.addListener((tab) => {
      console.log(tab.tabId);
      chrome.tabs.sendMessage(tab.tabId, {
        message: 'hello!',
        url: details.url,
      });
    });
  }
});
