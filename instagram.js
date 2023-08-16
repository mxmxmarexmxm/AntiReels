const imageURL = chrome.extension.getURL('icons/antireel.png');

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

// Hide reels in chat
const chatReelsObserver = new MutationObserver(() => {
  const reelIcons = document.querySelectorAll(
    'svg[class="_ab6-"][color="rgb(255, 255, 255)"][fill="rgb(255, 255, 255)"][height="24"][role="img"][viewBox="0 0 24 24"][width="24"]'
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
  hideDirectReels();
};

const disableScript = () => {
  sidebarMenuObserver.disconnect();
  chatReelsObserver.disconnect();
};

chrome.runtime.onMessage.addListener(function (message) {
  console.log(message)
  if (message.action === 'enableInstagram') {
    enableScript();
  } else {
    disableScript();
  }
});

chrome.storage.local.get(['isEnabled'], function (result) {
  console.log(result)
  if (result.isEnabled) {
    enableScript();
  }
});
