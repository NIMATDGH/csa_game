import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, loadUsers, setCurrentUser } from '../utils';

const LoginPage = () => {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = loadUsers();
    const user = users.find((u) => u.studentNumber === studentNumber.trim());
    if (user) {
      setCurrentUser(user.studentNumber);
      setError('');
      navigate('/');
    } else {
      setError('No account found. Create one?');
    }
  };

  if (getCurrentUser()) {
    navigate('/');
  }

  return (
    <div className="max-w-xl mx-auto card-glow bg-slate-900/70 rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-arenaYellow">Login</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm mb-2" htmlFor="studentNumber">
            Student Number
          </label>
          <input
            id="studentNumber"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-arenaPink"
            required
            inputMode="numeric"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-arenaPink to-arenaPurple rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-300">
        New here?{' '}
        <Link className="text-arenaTeal hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
