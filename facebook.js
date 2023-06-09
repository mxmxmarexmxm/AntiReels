const observer = new MutationObserver(() => {
  const link = document.querySelector('a[href="/reel/"]');
  if (link) {
    link.style.display = 'none';
  }
});

observer.observe(document, { childList: true, subtree: true });
