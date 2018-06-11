'use strict';

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.method === 'open') {
    chrome.tabs.create({
      url: request.url,
      index: sender.tab.index + 1
    });
  }
});
