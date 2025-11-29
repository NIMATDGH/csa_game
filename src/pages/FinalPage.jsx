import { useEffect, useMemo, useState } from 'react';
import Wheel from '../components/Wheel';
import {
  getCurrentUser,
  getFinalPlayers,
  getFinalWinner,
  isFinalMatchActive,
  loadQuestions,
  loadUsers,
  riskPenalty,
  saveUsers,
  scoringTable,
  setCurrentUser,
  setFinalMatchActive,
  setFinalWinner,
  updateRanking,
} from '../utils';

const targetScore = 20;

const FinalPage = () => {
  const user = getCurrentUser();
  const finalPlayers = getFinalPlayers();
  const winner = getFinalWinner();
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState('Spin the final wheel!');
  const [timer, setTimer] = useState(15);
  const [riskMode, setRiskMode] = useState(true);
  const eligible = finalPlayers.some((p) => p.studentNumber === user?.studentNumber);
  const finalActive = isFinalMatchActive();
  const questionBank = useMemo(() => loadQuestions(true), []);

  useEffect(() => {
    const interval = setInterval(() => updateRanking(), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!question) return undefined;
    setTimer(15);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMessage('Time up!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [question]);

  const selectQuestion = (diff) => {
    const pool = questionBank.filter((q) => q.difficulty === diff);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setQuestion(picked || null);
    setDifficulty(diff);
    setMessage('Final challenge loaded!');
  };

  const persistScore = (delta) => {
    const users = loadUsers();
    const updated = users.map((u) =>
      u.studentNumber === user.studentNumber ? { ...u, score: (u.score || 0) + delta } : u
    );
    saveUsers(updated);
    setCurrentUser(user.studentNumber);
    const refreshed = updateRanking();
    const me = refreshed.find((r) => r.studentNumber === user.studentNumber);
    if (me && me.score >= targetScore) {
      setFinalWinner({ ...me, finishedAt: Date.now() });
      setFinalMatchActive(false);
    }
  };

  const handleAnswer = (opt) => {
    if (!question) return;
    const correct = opt === question.answer;
    const base = scoringTable[difficulty] || 0;
    let delta = correct ? base : 0;
    if (!correct && riskMode) delta -= riskPenalty(difficulty);
    persistScore(delta);
    setMessage(correct ? `Correct! +${delta}` : `Wrong! ${delta}`);
    selectQuestion(difficulty);
  };

  if (!finalActive && !winner) {
    return (
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-arenaYellow mb-2">Final match is not active.</h1>
      </div>
    );
  }

  if (winner) {
    return (
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6 text-center">
        <p className="text-sm uppercase text-slate-400">Final Winner</p>
        <h1 className="text-4xl font-bold text-arenaTeal mb-2">{winner.fullName}</h1>
        <p className="text-xl text-slate-200">Score: {winner.score}</p>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-arenaYellow mb-2">Final Match In Progress — Please Wait</h1>
        <p className="text-slate-300">Only top 5 players can participate.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm uppercase text-slate-400">Finalist</p>
            <h2 className="text-2xl font-bold text-arenaYellow">{user.firstName} {user.lastName}</h2>
            <p className="text-slate-300">Goal: {targetScore} pts</p>
          </div>
          <Wheel onResult={selectQuestion} />
        </div>
        {difficulty && question && (
          <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs bg-slate-900 border border-slate-700">
                {question.subject} • {difficulty}
              </span>
              <span className="text-sm text-slate-300">{timer}s</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-arenaPink"
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">{message}</p>
          </div>
        )}
      </div>
      <aside className="card-glow bg-slate-900/70 rounded-2xl p-6">
        <p className="text-sm uppercase text-slate-400">Final Players</p>
        <ul className="mt-3 space-y-2 text-sm">
          {finalPlayers.map((p) => (
            <li key={p.studentNumber} className="flex justify-between">
              <span>
                {p.fullName} ({p.studentNumber})
              </span>
              <span className="text-arenaTeal font-semibold">{p.score} pts</span>
            </li>
          ))}
        </ul>
        <label className="flex items-center gap-2 mt-4 text-sm">
          <input type="checkbox" checked={riskMode} onChange={(e) => setRiskMode(e.target.checked)} />
          Risk mode (wrong subtracts points)
        </label>
      </aside>
    </div>
  );
};

export default FinalPage;
