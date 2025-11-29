import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isFinalMatchActive, logout } from '../utils';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const finalActive = isFinalMatchActive();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/70 backdrop-blur sticky top-0 z-20 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-arenaYellow drop-shadow">
          Quiz Spin Arena
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:text-arenaPink transition" to="/">Home</Link>
          <Link className="hover:text-arenaPink transition" to="/game">Game</Link>
          <Link className="hover:text-arenaPink transition" to="/ranking">Ranking</Link>
          <Link className="hover:text-arenaPink transition" to="/admin">Admin</Link>
          {finalActive && (
            <Link className="hover:text-arenaPink transition" to="/final">Final</Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 bg-arenaPink text-white rounded-full hover:shadow-lg"
            >
              Logout {user.firstName}
            </button>
          ) : (
            <Link className="px-3 py-1 bg-arenaTeal rounded-full" to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
