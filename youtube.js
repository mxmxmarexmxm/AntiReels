const observer = new MutationObserver(() => {
  const link = document.querySelector('a[title="Shorts"]');
  if (link) {
    link.style.display = 'none';
  }
});

observer.observe(document, { childList: true, subtree: true });
