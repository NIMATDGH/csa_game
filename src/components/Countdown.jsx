import { useEffect } from 'react';

const Countdown = ({ seconds, onExpire, running }) => {
  useEffect(() => {
    if (!running) return undefined;
    const timer = setTimeout(onExpire, seconds * 1000);
    return () => clearTimeout(timer);
  }, [seconds, running, onExpire]);

  if (!running) return null;
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-widest text-slate-300">Time Left</p>
      <p className="text-4xl font-bold countdown-pulse">{seconds}s</p>
    </div>
  );
};

export default Countdown;
