/* Original PowerPoint MP4s, synchronized without changing their pixels. */
(() => {
  'use strict';
  const demo = document.getElementById('schematic-demo');
  const clips = [document.getElementById('schematic-nonreactive'), document.getElementById('schematic-reactive')];
  const play = document.getElementById('schematic-play');
  const replay = document.getElementById('schematic-replay');
  const scrub = document.getElementById('schematic-scrub');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let requested = !reduced.matches, visible = false, raf = 0;
  // Skip only the presentation's white fade, keeping the complete maneuver.
  const startTime = .34, endTime = 5.45;
  function update() {
    const paused = clips[0].paused;
    play.textContent = paused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', paused ? 'Play conceptual animations together' : 'Pause conceptual animations');
  }
  function pause() { clips.forEach(v => v.pause()); cancelAnimationFrame(raf); update(); }
  function tick() {
    if (clips[0].currentTime >= endTime) { finish(); return; }
    scrub.value = Math.max(0, Math.min(100, (clips[0].currentTime - startTime) / (endTime - startTime) * 100));
    if (Math.abs(clips[1].currentTime - clips[0].currentTime) > .1 && clips[1].readyState >= 2) clips[1].currentTime = clips[0].currentTime;
    if (!clips[0].paused) raf = requestAnimationFrame(tick);
  }
  async function start(restart = false) {
    if (restart || clips[0].ended || clips[0].currentTime >= endTime - .02 || clips[0].currentTime < startTime) clips.forEach(v => { v.currentTime = startTime; });
    requested = true;
    const states = await Promise.allSettled(clips.map(v => v.play()));
    if (states.some(s => s.status === 'rejected') || !visible || document.hidden) { pause(); return; }
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); update();
  }
  play.addEventListener('click', () => { if (clips[0].paused) start(); else { requested = false; pause(); } });
  replay.addEventListener('click', () => start(true));
  scrub.addEventListener('input', () => {
    requested = false; pause();
    clips.forEach(v => { v.currentTime = startTime + Number(scrub.value) / 100 * (endTime - startTime); });
  });
  function finish() { requested = false; pause(); clips.forEach(v => { v.currentTime = endTime; }); scrub.value = 100; }
  clips[0].addEventListener('timeupdate', () => { if (!clips[0].paused && clips[0].currentTime >= endTime) finish(); });
  clips[0].addEventListener('ended', finish);
  clips.forEach(v => v.addEventListener('error', update));
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && requested && !document.hidden) start(); else pause();
  }, {threshold:.3}).observe(demo);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else if (visible && requested) start(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { requested = false; pause(); } });
  const methods = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in-view'); methods.unobserve(e.target); }
  }), {threshold:.5});
  document.querySelectorAll('.method-points article').forEach(el => methods.observe(el));
})();
