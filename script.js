// One keyboard-accessible photo viewer for each page gallery.
const photoLinks = [...document.querySelectorAll('[data-photo]')];
if (photoLinks.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-dialog';
  dialog.setAttribute('aria-label', 'Photo gallery');
  dialog.innerHTML = `
    <div class="viewer-toolbar"><span class="viewer-count" aria-live="polite"></span><button type="button" class="viewer-close" aria-label="Close photo">&times;</button></div>
    <div class="viewer-stage"><img class="viewer-image" alt=""></div>
    <div class="viewer-footer"><button type="button" class="viewer-prev" aria-label="Previous photo">&larr; <span>Previous</span></button><p class="viewer-caption" aria-live="polite"></p><button type="button" class="viewer-next" aria-label="Next photo"><span>Next</span> &rarr;</button></div>`;
  document.body.append(dialog);
  const image = dialog.querySelector('.viewer-image');
  const count = dialog.querySelector('.viewer-count');
  const caption = dialog.querySelector('.viewer-caption');
  const previous = dialog.querySelector('.viewer-prev');
  const next = dialog.querySelector('.viewer-next');
  let activeIndex = 0;
  let opener = null;
  let savedOverflow = '';
  function showPhoto(index) {
    activeIndex = (index + photoLinks.length) % photoLinks.length;
    const link = photoLinks[activeIndex];
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || 'Session photo';
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent.trim() || image.alt;
    count.textContent = `${activeIndex + 1} / ${photoLinks.length}`;
    previous.hidden = next.hidden = photoLinks.length < 2;
  }
  photoLinks.forEach((link, index) => link.addEventListener('click', event => {
    // Preserve opening the original file in a new tab with modifier keys.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    showPhoto(index);
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }));
  previous.addEventListener('click', () => showPhoto(activeIndex - 1));
  next.addEventListener('click', () => showPhoto(activeIndex + 1));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    opener?.focus();
  });
}
