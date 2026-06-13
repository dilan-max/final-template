const form = document.getElementById('settings-form');
const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('username-error');

const saved = localStorage.getItem('lastUsername');
if (saved) {
  usernameInput.value = saved;
}

function validateUsername(value) {
  if (!value.trim()) return 'Username is required.';
  if (value.trim().length < 2) return 'Must be at least 2 characters.';
  return '';
}

function showError(msg) {
  usernameError.textContent = msg;
  usernameInput.classList.toggle('form__input--error', msg.length > 0);
}

let debounceTimer = null;
usernameInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    showError(validateUsername(usernameInput.value));
  }, 300);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const error = validateUsername(usernameInput.value);
  if (error) {
    showError(error);
    usernameInput.focus();
    return;
  }

  showError('');

  sessionStorage.setItem('quizSettings', JSON.stringify({
    username: usernameInput.value.trim(),
    difficulty: form.querySelector('input[name="difficulty"]:checked').value,
    category: document.getElementById('category').value,
  }));

  window.location.href = 'quiz.html';
});
