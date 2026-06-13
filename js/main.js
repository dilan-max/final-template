const usernameInput = document.getElementById('username');

const saved = localStorage.getItem('lastUsername');
if (saved) {
  usernameInput.value = saved;
}
