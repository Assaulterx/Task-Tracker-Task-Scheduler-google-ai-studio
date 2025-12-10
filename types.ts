export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export enum Status {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum EnergyLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: string; // ISO string
  durationMinutes: number;
  energyLevel: EnergyLevel;
  tags: string[];
  subtasks: SubTask[];
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  tasksCompleted: number;
  focusMinutes: number;
  coins: number;
}

export interface UserProfile {
  name: string;
  email: string;
  age: string;
  dob: string;
  avatarUrl?: string;
  preferences: {
    dailyEmail: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
  };
}

export interface TimerSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}

export interface AIAnalysisResult {
  suggestion: string;
  priorityScore: number;
  estimatedDuration: number;
  breakdown?: string[];
}