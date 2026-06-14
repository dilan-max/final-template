const root = document.getElementById('results-root');

const CATEGORY_NAMES = {
  '0': 'Any Category',
  '9': 'General Knowledge',
  '10': 'Entertainment: Books',
  '11': 'Entertainment: Film',
  '12': 'Entertainment: Music',
  '17': 'Science & Nature',
  '18': 'Science: Computers',
  '21': 'Sports',
  '22': 'Geography',
  '23': 'History',
  '25': 'Art',
};

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const colors = ['#ff2d87','#7c00ff','#00cfff','#ffe600','#00e676','#ff6d00'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    w: 8 + Math.random() * 8,
    h: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
    drift: (Math.random() - 0.5) * 1.2,
  }));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let elapsed = 0;

  function tick() {
    elapsed++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allDone = true;
    for (const p of pieces) {
      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y < canvas.height + 20) allDone = false;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p.y - canvas.height * 0.75) / (canvas.height * 0.25));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (!allDone || elapsed < 180) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
      window.removeEventListener('resize', resize);
    }
  }

  requestAnimationFrame(tick);
}

function getResult() {
  const raw = sessionStorage.getItem('quizResult');
  return raw ? JSON.parse(raw) : null;
}

function getHighScore(username) {
  const raw = localStorage.getItem(`highScore_${username}`);
  return raw ? parseInt(raw, 10) : 0;
}

function saveHighScore(username, score, settings) {
  const prev = getHighScore(username);
  if (score > prev) {
    localStorage.setItem(`highScore_${username}`, score);
    if (settings) {
      localStorage.setItem(`playerSettings_${username}`, JSON.stringify(settings));
    }
  }
}

function getPlayerSettings(username) {
  const raw = localStorage.getItem(`playerSettings_${username}`);
  return raw ? JSON.parse(raw) : {};
}

function saveUsername(username) {
  localStorage.setItem('lastUsername', username);
}

function getAllHighScores() {
  const scores = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('highScore_')) {
      const username = key.slice('highScore_'.length);
      scores.push({
        username,
        score: parseInt(localStorage.getItem(key), 10),
        settings: getPlayerSettings(username),
      });
    }
  }
  return scores.sort((a, b) => b.score - a.score);
}

function grade(score, total) {
  const pct = score / total;
  if (pct === 1)   return 'Perfect! 🏆';
  if (pct >= 0.8)  return 'Great job!';
  if (pct >= 0.5)  return 'Not bad!';
  return 'Keep practicing!';
}

function buildTooltip(settings) {
  if (!settings || (!settings.category && !settings.difficulty)) return null;

  const tip = document.createElement('div');
  tip.className = 'leaderboard__tooltip';
  tip.setAttribute('role', 'tooltip');

  const rows = [
    ['Category', CATEGORY_NAMES[settings.category] || 'Any Category'],
    ['Difficulty', settings.difficulty
      ? settings.difficulty[0].toUpperCase() + settings.difficulty.slice(1)
      : 'Any'],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'leaderboard__tooltip-row';

    const lbl = document.createElement('span');
    lbl.className = 'leaderboard__tooltip-label';
    lbl.textContent = label;

    const val = document.createElement('span');
    val.className = 'leaderboard__tooltip-value';
    val.textContent = value;

    row.appendChild(lbl);
    row.appendChild(val);
    tip.appendChild(row);
  });

  return tip;
}

function renderLeaderboard(highlightUser, limit = 3) {
  const scores = getAllHighScores();
  if (scores.length === 0) return null;

  const section = document.createElement('div');
  section.className = 'leaderboard';

  const heading = document.createElement('h2');
  heading.className = 'leaderboard__title';
  heading.textContent = 'Leaderboard';
  section.appendChild(heading);

  const list = document.createElement('ol');
  list.className = 'leaderboard__list';

  scores.slice(0, limit).forEach(({ username, score, settings }, index) => {
    const item = document.createElement('li');
    item.className = 'leaderboard__item';
    item.style.animationDelay = `${(index + 1) * 60}ms`;
    if (username === highlightUser) item.classList.add('leaderboard__item--you');

    const rank = document.createElement('span');
    rank.className = 'leaderboard__rank';
    rank.textContent = index + 1;

    const name = document.createElement('span');
    name.className = 'leaderboard__name';
    name.textContent = username;

    const scoreEl = document.createElement('span');
    scoreEl.className = 'leaderboard__score';
    scoreEl.textContent = `${score} / 10`;

    item.appendChild(rank);
    item.appendChild(name);
    item.appendChild(scoreEl);

    const tooltip = buildTooltip(settings);
    if (tooltip) item.appendChild(tooltip);

    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}

function renderResults(result) {
  const { score, total, username } = result;
  const rawSettings = sessionStorage.getItem('quizSettings');
  const quizSettings = rawSettings ? JSON.parse(rawSettings) : {};
  saveHighScore(username, score, { category: quizSettings.category, difficulty: quizSettings.difficulty });
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
  highEl.textContent = `Your best: ${highScore} / ${total}`;

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

  const lb = renderLeaderboard(username);
  if (lb) root.appendChild(lb);
}

function renderNoResult() {
  const scores = getAllHighScores();

  if (scores.length > 0) {
    root.classList.add('results--full');

    const header = document.createElement('div');
    header.className = 'scores-header';

    const title = document.createElement('h1');
    title.className = 'scores-header__title';
    title.textContent = 'High Scores';

    const subtitle = document.createElement('p');
    subtitle.className = 'scores-header__subtitle';
    subtitle.textContent = `${scores.length} player${scores.length !== 1 ? 's' : ''} on the board`;

    header.appendChild(title);
    header.appendChild(subtitle);
    root.appendChild(header);

    const lb = renderLeaderboard(null, 10);
    root.appendChild(lb);

    const actions = document.createElement('div');
    actions.className = 'scores-actions';

    const link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'btn btn--primary';
    link.textContent = 'Play Now';

    actions.appendChild(link);
    root.appendChild(actions);
  } else {
    const empty = document.createElement('div');
    empty.className = 'scores-empty';

    const title = document.createElement('p');
    title.className = 'scores-empty__title';
    title.textContent = 'No scores yet';

    const hint = document.createElement('p');
    hint.className = 'scores-empty__hint';
    hint.textContent = 'Play a round to get on the board!';

    const link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'btn btn--primary scores-empty__btn';
    link.textContent = 'Play Now';

    empty.appendChild(title);
    empty.appendChild(hint);
    empty.appendChild(link);
    root.appendChild(empty);
  }
}

function launchSadAnimation() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const drops = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    speed: 3 + Math.random() * 3,
    length: 12 + Math.random() * 18,
    opacity: 0.15 + Math.random() * 0.35,
    drift: (Math.random() - 0.5) * 0.4,
  }));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of drops) {
      d.y += d.speed;
      d.x += d.drift;
      if (d.y > canvas.height + d.length) {
        d.y = -d.length;
        d.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.strokeStyle = `rgba(100, 160, 255, ${d.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.drift * 4, d.y + d.length);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const result = getResult();
if (result) {
  renderResults(result);
  if (result.score < 5) {
    launchSadAnimation();
  } else {
    launchConfetti();
  }
} else {
  renderNoResult();
}
