let temporaryList = [];
let originalLocation = window.location.href;
let cookies = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getLocalStorage") {
      chrome.tabs.executeScript(
        {
          code: "JSON.stringify(localStorage)"
        },
        function (result) {
          if (chrome.runtime.lastError || !result || !result[0]) {
            sendResponse({ localStorageData: null });
          } else {
            sendResponse({ localStorageData: JSON.parse(result[0]) });
          }
        }
      );
      return true;
    }
  });
browser.webNavigation.onCommitted.addListener(function(details) {
    if (details.frameId === 0) {
        originalLocation = details.url;
        browser.cookies.getAll({url: details.url}).then((_cookies) => {
          cookies = _cookies;
        });
    }
});

browser.tabs.onActivated.addListener(function(activeInfo) {
  
    browser.tabs.get(activeInfo.tabId, function(tab) {
        originalLocation = tab.url;
        browser.cookies.getAll({url: tab.url}).then((_cookies) => {
          cookies = _cookies;
        });
    });
});
function getCookies(){
  return cookies;
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(details.thirdParty){
            temporaryList.push({origin: originalLocation,url: details.url, time: new Date().toLocaleTimeString()});
        }
    },
    {urls: ["<all_urls>"]}
  );

function groupByTemporaryList(){
    let thirdPartyCallsGrouped = [];
    temporaryList.forEach(call => {
        if(!thirdPartyCallsGrouped.find((element) => element.url == call.url.split("//")[1].split("/")[0])){
            thirdPartyCallsGrouped.push({origin: call.origin,url: call.url.split("//")[1].split("/")[0], time: call.time, urlVirusTotal: `https://www.virustotal.com/gui/search/${encodeURI(call.url.split("//")[1].split("/")[0])}`});
        }
    });
    return thirdPartyCallsGrouped;
}

function getThirdPartyCalls() {
    return groupByTemporaryList().filter((call) => call.origin === originalLocation);
}
  
