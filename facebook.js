const imageURL = chrome.extension.getURL('icons/antireel.png');

// Observing document to remove Shorts from the sidebar menu
const sidebarMenuObserver = new MutationObserver(() => {
  const reelsLink = document.querySelector('a[href="/reel/"]');
  if (reelsLink) {
    reelsLink.remove();
    sidebarMenuObserver.disconnect();
  }
});

sidebarMenuObserver.observe(document, { childList: true, subtree: true });

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

hideDirectReel();
