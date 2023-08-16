const imageURL = chrome.extension.getURL('icons/antireel.png');

// Observing document to remove Shorts from the sidebar menu
const sidebarMenuObserver = new MutationObserver(() => {
  const reelsLink = document.querySelector('a[href="/reel/"]');
  if (reelsLink) {
    reelsLink.remove();
    sidebarMenuObserver.disconnect();
  }
});

const hideDirectReel = () => {
  let location = window.location.href;
  if (location.includes('/reel/')) {
    const reelDiv = document.querySelector('div[role="main"]');
    reelDiv.innerHTML = '';

    let container = document.createElement('div');
    container.style.height = '100vh';
    container.style.paddingLeft = '20px';
    container.style.paddingRight = '20px';
    container.style.backgroundColor = 'black';

    container.innerHTML = `
    <div id="reel-blocker" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; text-align:center; color:white">
      <div style="display: flex; flex-direction:column; align-items: center; justify-content: center; background: linear-gradient(to bottom, #333, #111); border-radius: 20px; padding:10px; max-width:500px; min-width: 300px; aspect-ratio:1/1">
        <h1 style="font-size:2rem; margin-bottom: 1rem; color: white;">Stay Productive!</h1>
        <p style="font-size:1rem;">This content has been blocked by the AntiReels extension.</p>
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 2rem; margin-bottom:2rem;">
          <img src="${imageURL}" alt="Block icon" width="200" height="200">
        </div>
        <p style="font-size:0.7rem; width:80%">If you want to enable this kind of content, please pause the extension. Remember to re-enable it later to stay productive for the rest of the day.</p>
      </div> 
    </div>
  `;
    reelDiv.appendChild(container);
  }
};

// Observing location to block direct link shorts
let prevLocation;
const locationObserver = new MutationObserver(() => {
  let location = window.location.href;
  if (location !== prevLocation) {
    prevLocation = location;
    hideDirectReel();
  }
});

// Hide reels in chat
const chatReelsObserver = new MutationObserver(() => {
  const reelLinks = document.querySelectorAll('a[aria-label^="Reel"]');

  if (reelLinks.length !== 0) {
    reelLinks.forEach((link) => {
      const parent = link.closest('div[role="none"]');

      parent.innerHTML = `
        <div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; text-align:center; ">
          <div style="display: flex; flex-direction:column; align-items: center; justify-content: center; background: linear-gradient(to bottom, #333, #111); border-radius: 20px; padding:10px; width: 150px; height: 280px; color: white ">
            <h1 style="font-size:1.2rem; margin-bottom: 1rem; color: white">Stay Productive!</h1>
            <div style="display: flex; align-items: center; justify-content: center;">
              <img src="${imageURL}" alt="Block icon" width="100" height="100">
            </div>
            <p style="font-size: 0.75rem;">This content has been blocked by the AntiReels extension.</p>
          </div>
        </div>
      `;

      link.remove();
    });
  }
});

const enableScript = () => {
  sidebarMenuObserver.observe(document, { childList: true, subtree: true });
  chatReelsObserver.observe(document, { childList: true, subtree: true });
  locationObserver.observe(document, { childList: true, subtree: true });
  hideDirectReel();
};

const disableScript = () => {
  sidebarMenuObserver.disconnect();
  chatReelsObserver.disconnect();
  locationObserver.disconnect();
};

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === 'enableFacebook') {
    enableScript();
  } else {
    disableScript();
  }
});

chrome.storage.local.get(['fbEnabled'], function (result) {
  if (result.fbEnabled) {
    enableScript();
  }
});
