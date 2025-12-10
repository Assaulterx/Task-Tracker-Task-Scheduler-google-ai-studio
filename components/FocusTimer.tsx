import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee } from 'lucide-react';

interface FocusTimerProps {
  updateFocusMinutes: (mins: number) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ updateFocusMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const totalTime = mode === 'work' ? 25 * 60 : (mode === 'shortBreak' ? 5 * 60 : 15 * 60);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Circumference for SVG circle
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (mode === 'work') {
            // Update stats logic could go here every minute, but simpler to do it on finish
        }
      }, 1000);
    } else if (timeLeft === 0) {
      if (isActive && mode === 'work') {
         updateFocusMinutes(25);
         // Play complete sound
      }
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, updateFocusMinutes]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : (newMode === 'shortBreak' ? 5 * 60 : 15 * 60));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="flex gap-4 mb-12 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
        {[
          { id: 'work', label: 'Deep Work' },
          { id: 'shortBreak', label: 'Short Break' },
          { id: 'longBreak', label: 'Long Break' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === m.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative mb-12">
        {/* Progress Ring */}
        <svg className="transform -rotate-90 w-80 h-80">
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`text-indigo-500 transition-all duration-1000 ease-linear ${isActive ? 'drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]' : ''}`}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-7xl font-bold text-white tracking-tighter mb-2 font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-slate-400 flex items-center justify-center gap-2">
            {isActive ? 'Stay Focused' : 'Ready?'}
            {mode !== 'work' && <Coffee size={18} />}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <button
          onClick={toggleTimer}
          className={`p-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl ${
            isActive 
              ? 'bg-amber-500/10 text-amber-500 border-2 border-amber-500/50 hover:bg-amber-500 hover:text-white' 
              : 'bg-indigo-600 text-white shadow-indigo-500/40 hover:bg-indigo-500'
          }`}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;