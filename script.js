'use strict';
// Progressive enhancement: all task descriptions remain available without JS.
document.documentElement.classList.add('js');
for (const list of document.querySelectorAll('[data-tabs]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  function activate(tab, moveFocus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
      if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
    }
    if (moveFocus) tab.focus();
  }
  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  }
  activate(tabs[0]);
}
const videos = [...document.querySelectorAll('video')];
// Play on request. Pause competing or off-screen videos to limit bandwidth and motion.
for (const video of videos) video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); }));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); }), { threshold: 0 });
  videos.forEach(video => observer.observe(video));
}
document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
