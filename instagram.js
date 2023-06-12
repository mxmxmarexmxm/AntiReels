// Remove reels icon from the sidebar menu
const imageURL = chrome.extension.getURL('icons/antireel.png');

const sidebarMenuObserver = new MutationObserver(() => {
  const reelsIcon = document.querySelector('a[href="/reels/"]');
  if (reelsIcon) {
    reelsIcon.style.display = 'none';
  }
});

sidebarMenuObserver.observe(document, { childList: true, subtree: true });

// Block reels from direct link
// Find and remove main element, create and append container with message
const hideDirectReels = () => {
  let location = window.location.href;
  if (location.includes('/reels/')) {
    let main = document.getElementsByTagName('main');
    main[0].remove();

    let section = document.getElementsByTagName('section');
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
    section[0].appendChild(container);
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

chatReelsObserver.observe(document, { childList: true, subtree: true });

hideDirectReels();
