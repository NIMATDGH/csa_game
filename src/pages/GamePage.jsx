import { useEffect, useMemo, useState } from 'react';
import Wheel from '../components/Wheel';
import {
  countdownTimer,
  formatName,
  getCurrentUser,
  loadQuestions,
  loadSubjects,
  loadUsers,
  riskPenalty,
  saveUsers,
  scoringTable,
  setCurrentUser,
  updateRanking,
} from '../utils';

const GamePage = () => {
  const user = getCurrentUser();
  const subjects = loadSubjects();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(15);
  const [resultMessage, setResultMessage] = useState('Spin to get your challenge!');
  const [riskMode, setRiskMode] = useState(false);
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [stealEnabled, setStealEnabled] = useState(false);
  const [doubleSpinEnabled, setDoubleSpinEnabled] = useState(false);

  const availableQuestions = useMemo(() => loadQuestions(false), []);

  useEffect(() => {
    const cancel = countdownTimer(
      60,
      () => {},
      () => {
        updateRanking();
      }
    );
    return cancel;
  }, []);

  useEffect(() => {
    if (!question) return undefined;
    setTimer(15);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleExpire = () => {
    setResultMessage('Time up! No points awarded.');
  };

  const selectQuestion = (diff) => {
    const pool = availableQuestions.filter((q) => q.subject === selectedSubject && q.difficulty === diff);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setQuestion(picked || null);
    setDifficulty(diff);
    setResultMessage('Answer before the timer ends!');
  };

  const persistScore = (delta) => {
    const users = loadUsers();
    const updated = users.map((u) =>
      u.studentNumber === user.studentNumber ? { ...u, score: (u.score || 0) + delta } : u
    );
    saveUsers(updated);
    setCurrentUser(user.studentNumber);
    updateRanking();
  };

  const handleSpinResult = (diff) => {
    selectQuestion(diff);
  };

  const handleAnswer = (option) => {
    if (!question) return;
    const correct = option === question.answer;
    const base = scoringTable[difficulty] || 0;
    let delta = correct ? base : 0;
    if (stealEnabled && correct) delta += 1;
    if (!correct && riskMode) delta -= riskPenalty(difficulty);
    persistScore(delta);
    setResultMessage(correct ? `Correct! +${delta} pts` : `Wrong! ${delta >= 0 ? '+0' : delta} pts`);
    selectQuestion(difficulty);
  };

  const handleSkip = () => {
    if (!skipEnabled || !difficulty) return;
    setResultMessage('Skipped. No points lost.');
    selectQuestion(difficulty);
  };

  const handleDoubleSpin = () => {
    if (!doubleSpinEnabled) return;
    setResultMessage('Double spin activated!');
    setDifficulty('');
    setQuestion(null);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6 lg:col-span-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase text-slate-400">Player</p>
            <h2 className="text-2xl font-bold text-arenaYellow">{formatName(user.firstName, user.lastName)}</h2>
            <p className="text-slate-300">Score: {user.score ?? 0}</p>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Wheel onResult={handleSpinResult} />
          </div>
        </div>

        {difficulty && question && (
          <div className="mt-4 bg-slate-800/60 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs bg-slate-900 border border-slate-700">
                {selectedSubject} • {difficulty}
              </span>
              <span className="text-sm text-slate-300">{timer}s left</span>
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
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>{resultMessage}</span>
              {skipEnabled && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700"
                >
                  Skip
                </button>
              )}
              {doubleSpinEnabled && (
                <button
                  type="button"
                  onClick={handleDoubleSpin}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700"
                >
                  Double Spin
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className="card-glow bg-slate-900/70 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase text-slate-400">Settings</p>
          <div className="space-y-3 mt-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={riskMode} onChange={(e) => setRiskMode(e.target.checked)} />
              Risk Mode (wrong subtracts points)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={skipEnabled} onChange={(e) => setSkipEnabled(e.target.checked)} />
              Enable Skip
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={stealEnabled} onChange={(e) => setStealEnabled(e.target.checked)} />
              Steal Bonus (+1 on correct)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={doubleSpinEnabled}
                onChange={(e) => setDoubleSpinEnabled(e.target.checked)}
              />
              Double Spin
            </label>
          </div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <p className="text-sm uppercase text-slate-400 mb-2">Scoring</p>
          <ul className="space-y-1 text-slate-200 text-sm">
            <li>Easy = +1</li>
            <li>Medium = +2</li>
            <li>Hard = +3</li>
            <li>Extreme = +5</li>
            <li>{riskMode ? 'Risk Mode: wrong subtracts points' : 'Wrong = 0'}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default GamePage;
