const DARK = 'theme-dark';
const btn = document.getElementById('theme-toggle');

function updateLabel(isDark) {
  if (btn) btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

if (btn) {
  updateLabel(document.body.classList.contains(DARK));

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle(DARK);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateLabel(isDark);
  });
}
