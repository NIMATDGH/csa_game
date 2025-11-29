import { useEffect, useState } from 'react';
import { getTopFivePlayers, isFinalMatchActive, setFinalMatchActive, setFinalPlayers, setFinalWinner, updateRanking } from '../utils';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [finalActive, setFinalActive] = useState(isFinalMatchActive());
  const [topFive, setTopFive] = useState(getTopFivePlayers());

  useEffect(() => {
    setTopFive(getTopFivePlayers());
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthorized(true);
    }
  };

  const handleStartFinal = () => {
    const refreshed = updateRanking();
    const top = refreshed.slice(0, 5);
    setFinalPlayers(top);
    setFinalWinner(null);
    setFinalMatchActive(true);
    setFinalActive(true);
    setTopFive(top);
  };

  const handleReset = () => {
    setFinalMatchActive(false);
    setFinalWinner(null);
    setFinalPlayers([]);
    setFinalActive(false);
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto card-glow bg-slate-900/70 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-arenaYellow mb-4">Admin Login</h1>
        <form className="space-y-4" onSubmit={handleAuth}>
          <div>
            <label className="text-sm block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-arenaPink to-arenaPurple rounded-lg">
            Enter
          </button>
          <p className="text-xs text-slate-400">Hint: admin123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="card-glow bg-slate-900/70 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase text-slate-400">Admin Panel</p>
          <h1 className="text-3xl font-bold text-arenaYellow">Match Controls</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartFinal}
            className="px-4 py-2 rounded-lg bg-arenaTeal text-slate-900 font-semibold"
          >
            Start Final Match
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mb-4 text-sm text-slate-300">
        Status: {finalActive ? 'Final Match In Progress — Please Wait' : 'Normal gameplay enabled'}
      </div>
      <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <p className="text-sm uppercase text-slate-400 mb-2">Top 5 Players</p>
        <ul className="space-y-2 text-sm">
          {topFive.map((player, idx) => (
            <li key={player.studentNumber} className="flex justify-between">
              <span>
                #{idx + 1} {player.fullName} ({player.studentNumber})
              </span>
              <span className="font-semibold text-arenaTeal">{player.score} pts</span>
            </li>
          ))}
          {!topFive.length && <li className="text-slate-400">No data yet. Play some games!</li>}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
