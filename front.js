document.addEventListener('DOMContentLoaded', function () {
  browser.runtime.getBackgroundPage().then((backgroundPage) => {
    const calls = backgroundPage.getThirdPartyCalls();
    const cookies = backgroundPage.getCookies();
    console.log(cookies);
    const list = document.getElementById('thirdPartyList');
    list.innerHTML = '';
    calls.forEach(call => {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.textContent = `URL: ${call.url}, Time: ${call.time}`;
      li.addEventListener('click', () => {
        browser.tabs.create({ url: call.urlVirusTotal });
      });
      list.appendChild(li);
    });
  });

  chrome.runtime.sendMessage({ action: "getLocalStorage" }, function (response) {
    const listStorage = document.getElementById('storageData');
    if (response && response.localStorageData) {
      Object.keys(response.localStorageData).forEach(key => {
        const li = document.createElement('li');
        li.className = 'list-item-2';
        li.textContent = `${key}: ${response.localStorageData[key]}`;
        listStorage.appendChild(li);
      });
    } else {
      storageDataDiv.textContent = 'Nenhum dado no localStorage encontrado.';
    }
  });
});
