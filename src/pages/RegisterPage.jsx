import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatName, loadUsers, saveUser, setCurrentUser } from '../utils';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentNumber: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'studentNumber' ? value.replace(/[^0-9]/g, '') : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = loadUsers();
    if (users.some((u) => u.studentNumber === form.studentNumber)) {
      setError('Student number already registered.');
      return;
    }
    const newUser = { ...form, score: 0 };
    saveUser(newUser);
    setCurrentUser(newUser.studentNumber);
    setError('');
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto card-glow bg-slate-900/70 rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-arenaYellow">Create Account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-2" htmlFor="studentNumber">
            Student Number
          </label>
          <input
            id="studentNumber"
            name="studentNumber"
            value={form.studentNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-arenaPink"
            required
            inputMode="numeric"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-arenaPink"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-arenaPink"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-arenaTeal to-arenaPurple rounded-lg font-semibold"
        >
          Create Account
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="text-arenaTeal hover:underline" to="/login">
          Login
        </Link>
      </p>
      <p className="mt-4 text-sm text-slate-400">Welcome, {formatName(form.firstName, form.lastName) || 'Champion'}!</p>
    </div>
  );
};

export default RegisterPage;
