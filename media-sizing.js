/* The actual gallery card is the upper size limit for other driving videos. */
(() => {
  const gallery = document.querySelector('.video-library');
  if (!gallery) return;
  function alignVideoWidths() {
    const card = gallery.querySelector('.library-media');
    const width = card?.getBoundingClientRect().width;
    if (width > 0) document.documentElement.style.setProperty('--gallery-video-width', `${width}px`);
  }
  alignVideoWidths();
  if ('ResizeObserver' in window) new ResizeObserver(alignVideoWidths).observe(gallery);
  else window.addEventListener('resize', alignVideoWidths, {passive:true});
})();
