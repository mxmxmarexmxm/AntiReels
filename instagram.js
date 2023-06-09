const observer = new MutationObserver(() => {
  const link = document.querySelector('a[href="/reels/"]');
  if (link) {
    link.style.display = 'none';
  }
});

observer.observe(document, { childList: true, subtree: true });
