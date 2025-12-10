import React from 'react';
import { UserStats, UserProfile } from '../types';
import { Trophy, Flame, Zap, User as UserIcon } from 'lucide-react';

interface GamificationBarProps {
  stats: UserStats;
  profile?: UserProfile;
}

const GamificationBar: React.FC<GamificationBarProps> = ({ stats, profile }) => {
  const xpForNextLevel = stats.level * 1000;
  const progress = (stats.xp / xpForNextLevel) * 100;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Level Badge */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
                {stats.level}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
                <div className="bg-slate-800 rounded-full p-1 border border-slate-700">
                  <Trophy size={10} className="text-amber-400" />
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {profile?.name ? profile.name : `Level ${stats.level}`}
              </div>
              <div className="text-sm text-white font-bold">Productivity Ninja</div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="hidden md:block w-48">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">{stats.xp} XP</span>
              <span className="text-slate-500">{xpForNextLevel} XP</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Flame className="text-orange-500" size={18} fill="currentColor" fillOpacity={0.6} />
            <div>
              <span className="text-white font-bold">{stats.streak}</span>
              <span className="text-xs text-slate-400 ml-1">Day Streak</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Zap className="text-yellow-400" size={18} />
             <div>
              <span className="text-white font-bold">{stats.focusMinutes}</span>
              <span className="text-xs text-slate-400 ml-1">Focus Mins</span>
            </div>
          </div>

          {profile && profile.avatarUrl ? (
             <img src={profile.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <UserIcon size={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationBar;