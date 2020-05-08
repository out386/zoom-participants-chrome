chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          //hostEquals: 'us04web.zoom.us',
          pathContains: 'home'
        },
      }), new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'us04web.zoom.us',
          pathContains: 'wc'
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
