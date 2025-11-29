import { useEffect, useState } from 'react';
import { spinWheel } from '../utils';

const colors = {
  Easy: 'bg-arenaTeal',
  Medium: 'bg-arenaYellow',
  Hard: 'bg-arenaPink',
  Extreme: 'bg-arenaPurple',
};

const Wheel = ({ onResult }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('Ready');

  const handleSpin = () => {
    const value = spinWheel();
    setSpinning(true);
    setTimeout(() => {
      setResult(value);
      setSpinning(false);
      onResult(value);
    }, 1300);
  };

  useEffect(() => {
    setResult('Ready');
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center text-2xl font-bold text-white shadow-2xl ${
          spinning ? 'wheel-spin' : ''
        } ${colors[result] || 'bg-slate-800'}`}
      >
        {result}
      </div>
      <button
        type="button"
        onClick={handleSpin}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-arenaPink to-arenaPurple text-white shadow-lg"
      >
        Spin Difficulty
      </button>
    </div>
  );
};

export default Wheel;
