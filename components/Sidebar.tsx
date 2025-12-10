import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Target, 
  BarChart2, 
  Sparkles, 
  Settings,
  User
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isMobile }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'My Tasks' },
    { id: 'focus', icon: Target, label: 'Focus Mode' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'ai-planner', icon: Sparkles, label: 'AI Planner' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const baseClasses = isMobile 
    ? "fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-4 z-50"
    : "w-64 bg-slate-900 h-screen border-r border-slate-800 p-6 flex flex-col";

  return (
    <div className={baseClasses}>
      {!isMobile && (
        <div className="mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nexus</h1>
        </div>
      )}

      <nav className={`${isMobile ? 'flex w-full justify-between' : 'space-y-2'}`}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${activeView === item.id 
                ? 'bg-indigo-600/20 text-indigo-400 font-medium shadow-sm shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              ${isMobile ? 'flex-col gap-1 p-2 text-xs' : ''}
            `}
          >
            <item.icon size={isMobile ? 20 : 20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {!isMobile && (
        <div className="mt-auto pt-6 border-t border-slate-800">
           {/* Settings functionality is now integrated into Profile or specific modules */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;