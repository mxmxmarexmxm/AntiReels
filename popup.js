document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.getElementById('ig');

  browser.storage.local.get('isEnabled').then((result) => {
    const isEnabled = result.isEnabled;
    checkbox.checked = isEnabled;

    checkbox.addEventListener('change', function () {
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;

        if (checkbox.checked) {
          // Store the value in browser.storage.local
          browser.storage.local.set({ isEnabled: true }).then(() => {
            // Send a message to the content script to enable
            browser.tabs.sendMessage(tabId, { action: 'enableInstagram' });
          });
        } else {
          // Store the value in browser.storage.local
          browser.storage.local.set({ isEnabled: false }).then(() => {
            // Send a message to the content script to disable
            browser.tabs.sendMessage(tabId, { action: 'disableInstagram' });
          });
        }
      });
    });
  });
});
