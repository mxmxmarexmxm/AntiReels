const imageURL = chrome.extension.getURL('icons/antireel.png');

// Observing document to remove Shorts from the sidebar menu
const sidebarMenuObserver = new MutationObserver(() => {
  const shortsLink = document.querySelector('a[title="Shorts"]');
  if (shortsLink) {
    shortsLink.remove();
    sidebarMenuObserver.disconnect();
  }
});

sidebarMenuObserver.observe(document, { childList: true, subtree: true });

const hideDirectShorts = () => {
  let location = window.location.href;
  if (location.includes('/shorts/')) {
    let body = document.body;
    body.innerHTML = '';

    let container = document.createElement('div');
    container.style.height = '100vh';
    container.style.paddingLeft = '20px';
    container.style.paddingRight = '20px';
    container.style.backgroundColor = 'black';
    container.style.zIndex = 100000;

    container.innerHTML = `
    <div id="reel-blocker" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; text-align:center; color:white">
      <div style="display: flex; flex-direction:column; align-items: center; justify-content: center; background: linear-gradient(to bottom, #333, #111); border-radius: 20px; padding:10px; max-width:700px; min-width: 400px; aspect-ratio:1/1">
        <h1 style="font-size:4rem; margin-bottom: 1rem;">Stay Productive!</h1>
        <p style="font-size:2rem;">This content has been blocked by the AntiReels extension.</p>
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 4rem; margin-bottom:4rem;">
          <img src="${imageURL}" alt="Block icon" width="200" height="200">
        </div>
        <p style="font-size:1.5rem; width:80%; margin-bottom: 2rem">If you want to enable this kind of content, please pause the extension. Remember to re-enable it later to stay productive for the rest of the day.</p>      
        <button class="padding:"1rem 2rem; background: white; color:black; border-radius: 25px">
          <a href="https://youtube.com/" style="font-size:1.5rem; text-decoration:none; focus-color: blue"> Home page </a>
        </button>
      </div> 
    </div>
  `;
    body.appendChild(container);
  }
};

// Observing location to block direct link shorts
let prevLocation;
const locationObserver = new MutationObserver(() => {
  let location = window.location.href;
  if (location.includes('/shorts/') && location !== prevLocation) {
    hideDirectShorts();
    prevLocation = location;
  }
});

locationObserver.observe(document, { childList: true, subtree: true });

// Observing suggestions to remove shorts from them
const contentObeserver = new MutationObserver(() => {
  const element = document.querySelector('[is-shorts]');
  if (element) {
    element.remove();
    contentObeserver.disconnect();
  }
});

contentObeserver.observe(document, { childList: true, subtree: true });
