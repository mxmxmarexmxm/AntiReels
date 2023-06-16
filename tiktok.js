const imageURL = chrome.extension.getURL('icons/antireel.png');

document.body.innerHTML = `
<div style="display: flex; width: 100%; height: 100vh; align-items: center; justify-content: center; text-align:center; ">
  <div style="display: flex; flex-direction:column; align-items: center; justify-content: center; background: linear-gradient(to bottom, #333, #111); border-radius: 20px; padding:10px; width: 100%; height: 100%; color: white ">
    <h1 style="font-size:3.6rem; margin-bottom: 3rem; color: white">Stay Productive!</h1>
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
      <img src="${imageURL}" alt="Block icon" width="300" height="300">
    </div>
    <p style="font-size: 2.25rem;">This content has been blocked by the AntiReels extension.</p>
  </div>
</div>
`;
