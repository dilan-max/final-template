const root = document.getElementById('results-root');

function getResult() {
  const raw = sessionStorage.getItem('quizResult');
  return raw ? JSON.parse(raw) : null;
}

function getHighScore(username) {
  const raw = localStorage.getItem(`highScore_${username}`);
  return raw ? parseInt(raw, 10) : 0;
}

function saveHighScore(username, score) {
  const prev = getHighScore(username);
  if (score > prev) {
    localStorage.setItem(`highScore_${username}`, score);
  }
}

function saveUsername(username) {
  localStorage.setItem('lastUsername', username);
}

function grade(score, total) {
  const pct = score / total;
  if (pct === 1)   return 'Perfect! 🏆';
  if (pct >= 0.8)  return 'Great job!';
  if (pct >= 0.5)  return 'Not bad!';
  return 'Keep practicing!';
}

function renderResults(result) {
  const { score, total, username } = result;
  saveHighScore(username, score);
  saveUsername(username);
  const highScore = getHighScore(username);

  const card = document.createElement('article');
  card.className = 'results__card';

  const title = document.createElement('h1');
  title.className = 'results__title';
  title.textContent = grade(score, total);

  const user = document.createElement('p');
  user.className = 'results__username';
  user.textContent = username;

  const scoreEl = document.createElement('p');
  scoreEl.className = 'results__score';
  scoreEl.textContent = `${score} / ${total}`;

  const highEl = document.createElement('p');
  highEl.className = 'results__highscore';
  highEl.textContent = `Best: ${highScore} / ${total}`;

  const actions = document.createElement('div');
  actions.className = 'results__actions';

  const playAgain = document.createElement('a');
  playAgain.href = 'index.html';
  playAgain.className = 'btn btn--primary';
  playAgain.textContent = 'Play Again';

  actions.appendChild(playAgain);
  card.appendChild(title);
  card.appendChild(user);
  card.appendChild(scoreEl);
  card.appendChild(highEl);
  card.appendChild(actions);

  root.appendChild(card);
}

function renderNoResult() {
  const msg = document.createElement('p');
  msg.className = 'error-msg';
  msg.textContent = 'No quiz result found. Play a round first!';

  const link = document.createElement('a');
  link.href = 'index.html';
  link.className = 'btn btn--secondary';
  link.style.marginTop = '1rem';
  link.textContent = 'Go Home';

  root.appendChild(msg);
  root.appendChild(link);
}

const result = getResult();
if (result) {
  renderResults(result);
} else {
  renderNoResult();
}
