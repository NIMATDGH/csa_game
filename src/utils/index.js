import baseQuestions from '../data/questions.json';
import baseFinalQuestions from '../data/final_questions.json';
import subjects from '../data/subjects.json';
import seedUsers from '../data/users.json';
import seedRanking from '../data/ranking.json';

const USER_KEY = 'users';
const CURRENT_KEY = 'currentUser';
const RANKING_KEY = 'ranking';
const FINAL_FLAG_KEY = 'finalMatchActive';
const FINAL_PLAYERS_KEY = 'finalPlayers';
const FINAL_WINNER_KEY = 'finalWinner';

export const formatName = (first, last) => `${first} ${last}`.trim();

export const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const spinWheel = () => {
  const options = ['Easy', 'Medium', 'Hard', 'Extreme'];
  return options[Math.floor(Math.random() * options.length)];
};

export const loadQuestions = (useFinal = false) => (useFinal ? baseFinalQuestions : baseQuestions);

export const loadSubjects = () => subjects;

export const loadUsers = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    localStorage.setItem(USER_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return seedUsers;
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
};

export const saveUser = (user) => {
  const users = loadUsers();
  const existing = users.find((u) => u.studentNumber === user.studentNumber);
  if (existing) {
    const updated = users.map((u) => (u.studentNumber === user.studentNumber ? { ...u, ...user } : u));
    saveUsers(updated);
    return user;
  }
  const newUsers = [...users, user];
  saveUsers(newUsers);
  return user;
};

export const setCurrentUser = (studentNumber) => {
  localStorage.setItem(CURRENT_KEY, studentNumber);
};

export const getCurrentUser = () => {
  const id = localStorage.getItem(CURRENT_KEY);
  if (!id) return null;
  return loadUsers().find((u) => u.studentNumber === id) || null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_KEY);
};

export const updateRanking = () => {
  const users = loadUsers();
  const ranking = users
    .map((u) => ({
      studentNumber: u.studentNumber,
      fullName: formatName(u.firstName, u.lastName),
      score: u.score || 0,
      updatedAt: Date.now(),
    }))
    .sort((a, b) => b.score - a.score);
  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
  return ranking;
};

export const loadRanking = () => {
  const raw = localStorage.getItem(RANKING_KEY);
  if (!raw) {
    localStorage.setItem(RANKING_KEY, JSON.stringify(seedRanking));
    return seedRanking;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return seedRanking;
  }
};

export const getTopFivePlayers = () => {
  const ranking = loadRanking();
  return ranking.sort((a, b) => b.score - a.score).slice(0, 5);
};

export const countdownTimer = (seconds, onTick, onEnd) => {
  let remaining = seconds;
  onTick(remaining);
  const timer = setInterval(() => {
    remaining -= 1;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(timer);
      onEnd();
    }
  }, 1000);
  return () => clearInterval(timer);
};

export const setFinalMatchActive = (flag) => {
  localStorage.setItem(FINAL_FLAG_KEY, JSON.stringify(flag));
};

export const isFinalMatchActive = () => JSON.parse(localStorage.getItem(FINAL_FLAG_KEY) || 'false');

export const setFinalPlayers = (players) => {
  localStorage.setItem(FINAL_PLAYERS_KEY, JSON.stringify(players));
};

export const getFinalPlayers = () => {
  const raw = localStorage.getItem(FINAL_PLAYERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const setFinalWinner = (winner) => {
  localStorage.setItem(FINAL_WINNER_KEY, JSON.stringify(winner));
};

export const getFinalWinner = () => {
  const raw = localStorage.getItem(FINAL_WINNER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const scoringTable = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Extreme: 5,
};

export const riskPenalty = (difficulty) => scoringTable[difficulty] || 0;
