import { Link } from 'react-router-dom';
import { formatName, getCurrentUser, isFinalMatchActive, loadRanking } from '../utils';

const HomePage = () => {
  const user = getCurrentUser();
  const ranking = loadRanking();
  const myRank = ranking.findIndex((r) => r.studentNumber === user?.studentNumber) + 1;
  const finalActive = isFinalMatchActive();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6">
        <p className="text-sm uppercase text-slate-400">Welcome</p>
        <h1 className="text-3xl font-bold text-arenaYellow mb-2">{formatName(user.firstName, user.lastName)}</h1>
        <p className="text-slate-300 mb-4">Student #{user.studentNumber}</p>
        <div className="flex gap-3">
          <Link
            to={finalActive ? '/final' : '/game'}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-arenaPink to-arenaPurple font-semibold"
          >
            {finalActive ? 'Go to Final Match' : 'Start Game'}
          </Link>
          <Link
            to="/ranking"
            className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 font-semibold"
          >
            View Ranking
          </Link>
        </div>
        {finalActive && (
          <div className="mt-4 text-arenaYellow font-semibold">Final Match In Progress — Please Wait</div>
        )}
      </div>
      <div className="card-glow bg-slate-900/70 rounded-2xl p-6">
        <p className="text-sm uppercase text-slate-400">Your stats</p>
        <div className="text-4xl font-bold text-arenaTeal">{user.score ?? 0} pts</div>
        <p className="text-slate-300 mt-2">Global Rank: {myRank || 'Unranked'}</p>
        <p className="text-slate-400 mt-4 text-sm">
          Keep spinning the wheel and answering questions to climb the leaderboard. Every 60 seconds the ranking syncs
          across all stored users.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
