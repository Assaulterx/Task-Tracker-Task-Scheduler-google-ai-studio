import React, { useState } from 'react';
import { Sparkles, Send, X, Bot } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm Nexus AI. I can help you plan your day, break down complex projects, or suggest improved schedules. What's on your mind?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');
    setIsThinking(true);

    // Mock AI response for visual demo since Chat API isn't fully wired in this specific file
    // In a real app, this would call geminiService.chat
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I've analyzed your request. Based on your productivity patterns, I suggest tackling the high-energy tasks first thing in the morning. Would you like me to rearrange your schedule?" 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <h2 className="font-bold text-white">Nexus Assistant</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
             <div className="flex justify-start">
               <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice, breakdown tasks..."
              className="w-full bg-slate-800 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-500"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
