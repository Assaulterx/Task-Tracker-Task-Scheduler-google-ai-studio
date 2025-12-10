import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import FocusTimer from './components/FocusTimer';
import GamificationBar from './components/GamificationBar';
import AIAssistant from './components/AIAssistant';
import ProfileSettings from './components/ProfileSettings';
import { parseNaturalLanguageTask, generateTaskBreakdown, getDailyMotivation } from './services/geminiService';
import { Task, UserStats, Priority, Status, EnergyLevel, UserProfile, TimerSettings } from './types';
import { Plus, Search, Filter, Loader2, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data - Initial Tasks kept for demo, but Profile data will be empty
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Draft the initial requirements for the Q4 marketing initiative.',
    priority: Priority.High,
    status: Status.Todo,
    dueDate: new Date().toISOString(),
    durationMinutes: 90,
    energyLevel: EnergyLevel.High,
    tags: ['Work', 'Planning'],
    subtasks: [],
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Gym Session',
    priority: Priority.Medium,
    status: Status.Todo,
    dueDate: new Date().toISOString(),
    durationMinutes: 45,
    energyLevel: EnergyLevel.High,
    tags: ['Health'],
    subtasks: [],
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'Review PRs',
    priority: Priority.Low,
    status: Status.Completed,
    dueDate: new Date().toISOString(),
    durationMinutes: 30,
    energyLevel: EnergyLevel.Medium,
    tags: ['Dev'],
    subtasks: [],
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [motivation, setMotivation] = useState('Loading daily inspiration...');
  
  // User Profile State - Empty by default
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    age: '',
    dob: '',
    preferences: {
      dailyEmail: false,
      weeklyReport: false,
      monthlyReport: false
    }
  });

  // Timer Settings State
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15
  });
  
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    tasksCompleted: 0,
    focusMinutes: 0,
    coins: 0
  });

  useEffect(() => {
    // Initial load effects
    getDailyMotivation(stats).then(setMotivation);
  }, []);

  // --- Handlers ---

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // Persist to local storage or backend in real app
  };

  const handleUpdateTimerSettings = (settings: TimerSettings) => {
    setTimerSettings(settings);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    setIsProcessingAI(true);
    
    // Use AI to parse the natural language input
    const parsed = await parseNaturalLanguageTask(newTaskInput);
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: parsed.title || newTaskInput,
      description: parsed.description || '',
      priority: parsed.priority || Priority.Medium,
      status: Status.Todo,
      dueDate: new Date().toISOString(),
      durationMinutes: parsed.durationMinutes || 30,
      energyLevel: parsed.energyLevel || EnergyLevel.Medium,
      tags: parsed.tags || [],
      subtasks: [],
      createdAt: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
    setIsProcessingAI(false);
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = t.status !== Status.Completed;
        // Gamification logic
        if (isCompleting) {
            setStats(s => ({
                ...s,
                xp: s.xp + 100 + (t.priority === Priority.High ? 50 : 0),
                tasksCompleted: s.tasksCompleted + 1,
                coins: s.coins + 10
            }));
            // Check level up logic (simplified)
            if (stats.xp + 100 > stats.level * 1000) {
                setStats(s => ({ ...s, level: s.level + 1 }));
                // In real app, show modal
            }
        }
        return { ...t, status: isCompleting ? Status.Completed : Status.Todo };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const breakDownTask = async (task: Task) => {
     // AI Breakdown logic
     const subtaskTitles = await generateTaskBreakdown(task.title);
     const newSubtasks = subtaskTitles.map((title, idx) => ({
         id: `${task.id}-sub-${idx}`,
         title,
         completed: false
     }));

     setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, subtasks: newSubtasks } : t
     ));
  };

  const updateFocusMinutes = (mins: number) => {
      setStats(prev => ({
          ...prev,
          focusMinutes: prev.focusMinutes + mins,
          xp: prev.xp + (mins * 2) // 2 XP per minute of focus
      }));
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Motivation */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            {userProfile.name ? `Welcome back, ${userProfile.name}.` : 'Welcome back, Creator.'}
          </h2>
          <p className="text-indigo-200 text-lg font-light italic">"{motivation}"</p>
          <div className="mt-6 flex gap-4">
            <button 
                onClick={() => setActiveView('ai-planner')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/40">
                <Sparkles size={18} /> Plan My Day
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Today's Progress</h3>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-bold text-white">
                {Math.round((tasks.filter(t => t.status === Status.Completed).length / (tasks.length || 1)) * 100)}%
             </span>
             <span className="text-slate-500 mb-1">completed</span>
           </div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
             <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${(tasks.filter(t => t.status === Status.Completed).length / (tasks.length || 1)) * 100}%` }} 
             />
           </div>
        </div>

        {/* Priority Tasks */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Up Next</h3>
            <div className="space-y-3">
                {tasks.filter(t => t.status !== Status.Completed).slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${task.priority === Priority.High ? 'bg-red-400' : 'bg-blue-400'}`} />
                            <span className="text-slate-200 font-medium">{task.title}</span>
                        </div>
                        <span className="text-xs text-slate-500">{task.durationMinutes}m</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Chart Preview */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-[300px]">
         <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Productivity Trend</h3>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
                { name: 'Mon', xp: 0 }, { name: 'Tue', xp: 0 }, { name: 'Wed', xp: 0 },
                { name: 'Thu', xp: 0 }, { name: 'Fri', xp: 0 }, { name: 'Sat', xp: 0 }, { name: 'Sun', xp: 0 }
            ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="xp" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8' }} />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-xl border border-slate-700">
         <Search className="text-slate-500 ml-2" size={20} />
         <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"
         />
         <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <Filter size={20} />
         </button>
       </div>

       <form onSubmit={handleAddTask} className="relative group">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            disabled={isProcessingAI}
            placeholder="Add a new task (e.g. 'Read book for 30 mins tomorrow at 10am')"
            className="w-full bg-slate-800/80 backdrop-blur-sm text-white pl-4 pr-14 py-4 rounded-2xl border-2 border-slate-700 focus:border-indigo-500 focus:ring-0 outline-none transition-all shadow-lg placeholder:text-slate-500"
          />
          <button 
            type="submit" 
            disabled={isProcessingAI || !newTaskInput}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all"
          >
            {isProcessingAI ? <Loader2 className="animate-spin" size={20} /> : <Plus size={24} />}
          </button>
          <div className="absolute -bottom-6 left-4 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
             <Sparkles size={10} className="text-indigo-400" />
             AI-Powered Natural Language Parsing Active
          </div>
       </form>

       <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20 custom-scrollbar mt-4">
          {tasks.length === 0 ? (
              <div className="text-center text-slate-500 mt-20">
                  <p>No tasks yet. Start building your legacy.</p>
              </div>
          ) : (
              tasks.sort((a,b) => b.createdAt - a.createdAt).map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={completeTask} 
                    onDelete={deleteTask}
                    onBreakdown={breakDownTask}
                />
              ))
          )}
       </div>
    </div>
  );

  const renderAnalytics = () => (
      <div className="space-y-6 h-full overflow-y-auto pr-2">
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h4 className="text-slate-400 text-xs uppercase mb-2">Total XP</h4>
                <div className="text-3xl font-bold text-white">{stats.xp.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h4 className="text-slate-400 text-xs uppercase mb-2">Focus Hours</h4>
                <div className="text-3xl font-bold text-white">{(stats.focusMinutes / 60).toFixed(1)}</div>
            </div>
         </div>

         <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-[350px]">
             <h3 className="text-slate-200 font-semibold mb-6">Weekly Focus Distribution</h3>
             <ResponsiveContainer width="100%" height="85%">
                <BarChart data={[
                    { name: 'Mon', mins: 0 }, { name: 'Tue', mins: 0 }, { name: 'Wed', mins: 0 },
                    { name: 'Thu', mins: 0 }, { name: 'Fri', mins: 0 }, { name: 'Sat', mins: 0 }, { name: 'Sun', mins: 0 }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                    <Bar dataKey="mins" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
         </div>
      </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <GamificationBar stats={stats} profile={userProfile} />
        
        <div className="flex-1 overflow-hidden p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'tasks' && renderTasks()}
          {activeView === 'focus' && (
            <FocusTimer 
              updateFocusMinutes={updateFocusMinutes} 
              settings={timerSettings}
              onUpdateSettings={handleUpdateTimerSettings}
            />
          )}
          {activeView === 'analytics' && renderAnalytics()}
          {activeView === 'profile' && (
             <ProfileSettings profile={userProfile} onUpdate={handleUpdateProfile} />
          )}
          {activeView === 'ai-planner' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="bg-slate-800 p-8 rounded-full mb-4">
                      <Sparkles size={48} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">AI Assistant Ready</h2>
                  <p className="text-slate-400 max-w-md">Open the assistant to plan your day, break down tasks, or get productivity advice.</p>
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                  >
                      Open Assistant
                  </button>
              </div>
          )}
        </div>
        
        {/* Mobile Navigation Spacer */}
        <div className="h-20 md:hidden" />
      </main>

      <AIAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
    </div>
  );
};

export default App;