import React from 'react';
import { CheckCircle, Circle, Clock, Tag, Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Task, Priority, EnergyLevel } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onBreakdown: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onBreakdown }) => {
  const [expanded, setExpanded] = React.useState(false);

  const priorityColors = {
    [Priority.Low]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [Priority.Medium]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [Priority.High]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    [Priority.Urgent]: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const energyColors = {
    [EnergyLevel.Low]: 'text-emerald-400',
    [EnergyLevel.Medium]: 'text-yellow-400',
    [EnergyLevel.High]: 'text-red-400',
  };

  return (
    <div className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl p-4 transition-all duration-300 ease-out shadow-lg shadow-black/5">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onComplete(task.id)}
          className="mt-1 text-slate-500 hover:text-indigo-400 transition-colors"
        >
          {task.status === 'Completed' ? (
            <CheckCircle className="w-6 h-6 text-indigo-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-1">{task.description}</p>
              )}
            </div>
            
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
              <Clock size={12} />
              <span>{task.durationMinutes}m</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
              <Zap size={12} className={energyColors[task.energyLevel]} />
              <span>{task.energyLevel} Energy</span>
            </div>

            {task.tags.map(tag => (
              <div key={tag} className="flex items-center gap-1 text-xs text-slate-500">
                <Tag size={10} />
                <span>{tag}</span>
              </div>
            ))}
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
              {task.subtasks.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtasks</p>
                  {task.subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-2 pl-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${st.completed ? 'bg-indigo-500' : 'bg-slate-600'}`} />
                      <span className={`text-sm ${st.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onBreakdown(task)}
                    className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Sparkles size={14} />
                    AI Breakdown
                  </button>
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => onDelete(task.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                >
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
