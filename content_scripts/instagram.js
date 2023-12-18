const imageURL = chrome.runtime.getURL('images/antireel.png');

// Remove reels icon from the sidebar menu
const sidebarMenuObserver = new MutationObserver(() => {
  const reelsIcon = document.querySelector('a[href="/reels/"]');
  if (reelsIcon) {
    const parentDiv = reelsIcon.closest('div:not([class])');
    parentDiv.remove();
  }
});

// Block reels from direct link
// Find and remove main element, create and append container with message
const hideDirectReels = () => {
  let location = window.location.href;
  if (location.includes('/reels/') || location.includes('/p/')) {
    let main = document.getElementsByTagName('main');
    main[0].remove();

    let section = document.getElementsByTagName('section')[0];
    let container = document.createElement('div');
    container.style.height = '100vh';
    container.style.paddingLeft = '20px';
    container.style.paddingRight = '20px';

    container.innerHTML = `
    <div style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; text-align:center; ">
      <div style="display: flex; flex-direction:column; align-items: center; justify-content: center; background: linear-gradient(to bottom, #333, #111); border-radius: 20px; padding:10px; max-width:500px; min-width: 300px; aspect-ratio:1/1">
        <h1 style="font-size:2rem; margin-bottom: 1rem;">Stay Productive!</h1>
        <p style="font-size:1rem;">This content has been blocked by the AntiReels extension.</p>
        <div style="display: flex; align-items: center; justify-content: center;">
          <img src="${imageURL}" alt="Block icon" width="200" height="200">
        </div>
        <p style="font-size:0.7rem; width:80%;">If you want to enable this kind of content, please pause the extension. Remember to re-enable it later to stay productive for the rest of the day.</p>      
      </div> 
    </div>
  `;
    section.appendChild(container);
  }
};

// Observing location to block direct link reels
let prevLocation;
const locationObserver = new MutationObserver(() => {
  let location = window.location.href;
  if (location !== prevLocation) {
    prevLocation = location;
    hideDirectReels();
  }
});

// Hide reels in chat
const chatReelsObserver = new MutationObserver(() => {
  // Target a reel's icons by their path.
  const reelIcons = document.querySelectorAll(
    'path[d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"]'
  );

  if (reelIcons.length !== 0) {
    reelIcons.forEach((icon) => {
      const parent = icon.closest('div[role="button"]');

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

      icon.remove();
    });
  }
});

const enableScript = () => {
  sidebarMenuObserver.observe(document, { childList: true, subtree: true });
  chatReelsObserver.observe(document, { childList: true, subtree: true });
  locationObserver.observe(document, { childList: true, subtree: true });
  hideDirectReels();
};

const disableScript = () => {
  sidebarMenuObserver.disconnect();
  chatReelsObserver.disconnect();
  locationObserver.disconnect();
};

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === 'enableInstagram') {
    enableScript();
  } else {
    disableScript();
  }
});

chrome.storage.local.get(['igEnabled'], function (result) {
  if (result.igEnabled) {
    enableScript();
  }
});
