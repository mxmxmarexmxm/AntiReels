document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.getElementById('ig');

  checkbox.addEventListener('change', function () {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      if (checkbox.checked) {
        browser.tabs.sendMessage(tabId, { action: 'enableInstagram' });
      } else {
        browser.tabs.sendMessage(tabId, { action: 'disableInstagram' });
      }
    });
  });
});
