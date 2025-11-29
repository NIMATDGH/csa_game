import { useEffect, useState } from 'react';
import { getCurrentUser, loadRanking, updateRanking } from '../utils';

const RankingPage = () => {
  const [ranking, setRanking] = useState(updateRanking());
  const me = getCurrentUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setRanking(updateRanking());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRanking(loadRanking());
  }, []);

  return (
    <div className="card-glow bg-slate-900/70 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase text-slate-400">Global Ranking</p>
          <h1 className="text-3xl font-bold text-arenaYellow">Top Players</h1>
        </div>
        <button
          type="button"
          onClick={() => setRanking(updateRanking())}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
        >
          Refresh now
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Student #</th>
              <th className="py-2">Score</th>
              <th className="py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((entry, idx) => (
              <tr
                key={entry.studentNumber}
                className={`border-t border-slate-800 ${entry.studentNumber === me?.studentNumber ? 'bg-slate-800/40' : ''}`}
              >
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">{entry.fullName}</td>
                <td className="py-2">{entry.studentNumber}</td>
                <td className="py-2 font-semibold text-arenaTeal">{entry.score}</td>
                <td className="py-2 text-xs text-slate-400">{new Date(entry.updatedAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingPage;
