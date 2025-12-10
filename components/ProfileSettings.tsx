import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Camera, Save, Mail, Calendar, User, Clock, Bell } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handlePreferenceChange = (key: keyof UserProfile['preferences']) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
    setIsSaved(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8 pb-10">
      
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
        {isSaved && (
          <span className="text-emerald-400 font-medium flex items-center gap-2 animate-scale-up">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Changes Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Avatar */}
        <div className="col-span-1 flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-indigo-500 transition-colors shadow-2xl bg-slate-800">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-indigo-400">
                  <User size={64} className="mb-2" />
                  <span className="text-xs font-medium">Upload Photo</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-2 right-4 bg-indigo-600 p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
              <Camera size={20} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <p className="text-slate-400 text-sm text-center">
            Click to upload a new profile picture.<br/>Recommended size: 400x400px.
          </p>
        </div>

        {/* Right Column - Details */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          
          {/* Personal Info */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Years"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Preferences */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Bell size={20} className="text-amber-400" />
              Email Notifications & Reports
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.preferences.dailyEmail ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                    {formData.preferences.dailyEmail && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Daily Progress Email</div>
                    <div className="text-xs text-slate-500">Receive a summary of your tasks every morning</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData.preferences.dailyEmail}
                  onChange={() => handlePreferenceChange('dailyEmail')}
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.preferences.weeklyReport ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                    {formData.preferences.weeklyReport && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Weekly Performance Report</div>
                    <div className="text-xs text-slate-500">Detailed analytics and insights delivered on Mondays</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData.preferences.weeklyReport}
                  onChange={() => handlePreferenceChange('weeklyReport')}
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.preferences.monthlyReport ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500'}`}>
                    {formData.preferences.monthlyReport && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Monthly Deep Dive</div>
                    <div className="text-xs text-slate-500">Comprehensive productivity analysis and goal tracking</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData.preferences.monthlyReport}
                  onChange={() => handlePreferenceChange('monthlyReport')}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/30 active:scale-95"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;