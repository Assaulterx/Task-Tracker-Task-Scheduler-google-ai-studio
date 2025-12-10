import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority, EnergyLevel } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for parsing natural language into a task
const taskParsingSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Urgent'] },
    energyLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    estimatedMinutes: { type: Type.INTEGER },
    suggestedTags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    }
  },
  required: ['title', 'priority', 'estimatedMinutes', 'energyLevel']
};

export const parseNaturalLanguageTask = async (input: string): Promise<Partial<Task>> => {
  if (!apiKey) {
    // Fallback for demo if no API key
    return {
      title: input,
      priority: Priority.Medium,
      energyLevel: EnergyLevel.Medium,
      durationMinutes: 30,
      tags: ['Quick Add']
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this task request and extract structured data: "${input}". 
      Infer priority and energy level based on the context. 
      If a time is mentioned, assume it's for today or tomorrow as appropriate, but return the duration in minutes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: taskParsingSchema,
        systemInstruction: "You are a productivity expert helping a user organize their life."
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      title: data.title,
      description: data.description,
      priority: data.priority as Priority,
      energyLevel: data.energyLevel as EnergyLevel,
      durationMinutes: data.estimatedMinutes,
      tags: data.suggestedTags || []
    };
  } catch (error) {
    console.error("AI Task Parsing Error:", error);
    return {
      title: input,
      priority: Priority.Medium,
      durationMinutes: 30,
      energyLevel: EnergyLevel.Medium,
      tags: ['Manual']
    };
  }
};

export const generateTaskBreakdown = async (taskTitle: string): Promise<string[]> => {
  if (!apiKey) return ["Step 1: Define scope", "Step 2: Research", "Step 3: Execute"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the task "${taskTitle}" into 3-5 actionable subtasks. Return only the subtask titles as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Breakdown Error:", error);
    return [];
  }
};

export const getDailyMotivation = async (userStats: any): Promise<string> => {
  if (!apiKey) return "Focus on being productive instead of busy.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, punchy motivational quote for a user with level ${userStats.level} and ${userStats.streak} day streak. Keep it under 20 words.`,
    });
    return response.text || "Keep pushing forward!";
  } catch (e) {
    return "Great things take time.";
  }
};
