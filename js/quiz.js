import { fetchQuestions } from './api.js';

const root = document.getElementById('quiz-root');

const state = {
  questions: [],
  current: 0,
  score: 0,
  username: '',
};

function buildProgressBar(current, total) {
  const wrap = document.createElement('div');
  wrap.className = 'progress';

  const bar = document.createElement('div');
  bar.className = 'progress__bar';
  bar.style.width = `${((current) / total) * 100}%`;

  const label = document.createElement('span');
  label.className = 'progress__label';
  label.textContent = `${current} / ${total}`;

  wrap.appendChild(bar);
  wrap.appendChild(label);
  return wrap;
}

function buildScoreDisplay() {
  const score = document.createElement('div');
  score.className = 'quiz__score';
  score.id = 'score-display';
  score.textContent = `Score: ${state.score}`;
  return score;
}

function buildAnswerButtons(question) {
  const grid = document.createElement('div');
  grid.className = 'answers';

  question.answers.forEach((answer) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answers__btn';
    btn.textContent = answer;

    btn.addEventListener('click', () => handleAnswer(btn, answer, question));

    grid.appendChild(btn);
  });

  return grid;
}

function renderQuestion(index) {
  root.innerHTML = '';

  const question = state.questions[index];
  const total = state.questions.length;

  const card = document.createElement('article');
  card.className = 'quiz__card';

  const header = document.createElement('div');
  header.className = 'quiz__header';
  header.appendChild(buildProgressBar(index, total));
  header.appendChild(buildScoreDisplay());

  const meta = document.createElement('p');
  meta.className = 'quiz__meta';
  meta.textContent = `${question.category} · ${question.difficulty}`;

  const questionEl = document.createElement('h2');
  questionEl.className = 'quiz__question';
  questionEl.textContent = question.question;

  card.appendChild(header);
  card.appendChild(meta);
  card.appendChild(questionEl);
  card.appendChild(buildAnswerButtons(question));

  root.appendChild(card);
}

function handleAnswer(_btn, _selected, _question) {
  // implemented in next commit
}

async function init() {
  const settings = JSON.parse(sessionStorage.getItem('quizSettings') || '{}');
  state.username = settings.username || 'Player';

  state.questions = await fetchQuestions(settings.difficulty, settings.category);
  state.current = 0;
  state.score = 0;

  renderQuestion(state.current);
}

init();
