document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.getElementById('ig');

  chrome.storage.local.get(['isEnabled'], function (result) {
    const isEnabled = result.isEnabled;
    checkbox.checked = isEnabled;
    console.log(isEnabled, 'isEnabled');

    checkbox.addEventListener('change', function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;

        if (checkbox.checked) {
          // Store the value in chrome.storage.local
          chrome.storage.local.set({ isEnabled: true }, function () {
            if (chrome.runtime.lastError) {
              console.error('Error setting storage:', chrome.runtime.lastError);
            } else {
              // Send a message to the content script to enable
              chrome.tabs.sendMessage(tabId, { action: 'enableInstagram' });
            }
          });
        } else {
          // Store the value in chrome.storage.local
          chrome.storage.local.set({ isEnabled: false }, function () {
            if (chrome.runtime.lastError) {
              console.error('Error setting storage:', chrome.runtime.lastError);
            } else {
              // Send a message to the content script to disable
              chrome.tabs.sendMessage(tabId, { action: 'disableInstagram' });
            }
          });
        }
      });
    });
  });
});
