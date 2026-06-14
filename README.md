# Trivia Quiz

A browser-based trivia game that fetches questions from the [Open Trivia Database](https://opentdb.com/) API. Players configure a quiz, answer questions one at a time, and their scores are saved to a local leaderboard.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Settings form — choose username, category, and difficulty, then start the quiz |
| Quiz | `quiz.html` | Question cards rendered one at a time with answer feedback |
| High Scores | `results.html` | Leaderboard of past scores stored in `localStorage` |

## Features

- Fetches trivia questions from the Open Trivia Database API
- Category selection (General Knowledge, Film, Music, Science, Sports, Geography, History, Art, and more)
- Difficulty selection: Easy / Medium / Hard
- Per-question answer feedback (correct / incorrect highlight)
- Score tracking and persistent leaderboard via `localStorage`
- Dark / light theme toggle, persisted across sessions

## File Structure

```
trivia-quiz/
├── index.html        ← home / settings page
├── quiz.html         ← active quiz page
├── results.html      ← high scores leaderboard
├── css/
│   └── style.css     ← all styles + CSS custom properties for theming
├── js/
│   ├── main.js       ← settings form logic, hands off to quiz.html
│   ├── quiz.js       ← fetches questions, renders cards, tracks score
│   ├── results.js    ← reads localStorage and renders leaderboard
│   ├── api.js        ← Open Trivia DB fetch helpers
│   └── theme.js      ← dark/light toggle
└── assets/
```

## Running the App

Open `index.html` in a browser. No build step or server required — all dependencies are native browser APIs.
