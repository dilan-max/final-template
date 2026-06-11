const API_BASE = 'https://opentdb.com/api.php';

function buildUrl(difficulty, category) {
  const params = new URLSearchParams({
    amount: 10,
    type: 'multiple',
  });
  if (difficulty) params.set('difficulty', difficulty);
  if (category && category !== '0') params.set('category', category);
  return `${API_BASE}?${params}`;
}

function decodeEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function normalizeQuestion(raw) {
  return {
    question: decodeEntities(raw.question),
    correct: decodeEntities(raw.correct_answer),
    answers: shuffle([raw.correct_answer, ...raw.incorrect_answers].map(decodeEntities)),
    category: decodeEntities(raw.category),
    difficulty: raw.difficulty,
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function fetchQuestions(difficulty, category) {
  const res = await fetch(buildUrl(difficulty, category));
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  if (data.response_code !== 0) throw new Error('Not enough questions for these settings.');
  return data.results.map(normalizeQuestion);
}
