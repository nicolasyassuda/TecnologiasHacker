let score = 100;

document.addEventListener('DOMContentLoaded', function () {
  browser.runtime.getBackgroundPage().then((backgroundPage) => {
    const calls = backgroundPage.getThirdPartyCalls();
    const cookies = backgroundPage.getCookies();
    const list = document.getElementById('thirdPartyList');
    list.innerHTML = '';
    calls.forEach(call => {
      score -= 0.25;
      const li = document.createElement('li');
      li.className = 'list-item';
      li.textContent = `URL: ${call.url}, Time: ${call.time}`;
      li.addEventListener('click', () => {
        browser.tabs.create({ url: call.urlVirusTotal });
      });
      list.appendChild(li);
    });
    const listCookies = document.getElementById('cookiesList');
    cookies.forEach(cookie => {
      score -= 0.25;
      const li = document.createElement('li');
      li.textContent = `Name: ${cookie.name}, Value: ${cookie.value}`;
      listCookies.appendChild(li);
    });
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${score}`;
    scoreElement.style.backgroundColor = score > 50 ? 'green' : 'red';

  });

  chrome.runtime.sendMessage({ action: "getLocalStorage" }, function (response) {
    const listStorage = document.getElementById('storageData');
    if (response && response.localStorageData) {
      Object.keys(response.localStorageData).forEach(key => {
        score -= 0.25;
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
