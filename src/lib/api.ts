const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Monument {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  description: string;
  history: string;
  modelUrl: string;
  image: string;
  yearBuilt: string;
  architect: string;
  category: 'temple' | 'fort' | 'palace' | 'monument' | 'tomb';
  era: 'ancient' | 'medieval' | 'modern';
  region: 'north' | 'south' | 'east' | 'west' | 'central';
  funFacts: string[];
}

export interface QuizQuestion {
  id: string;
  monumentId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface UserProgress {
  visitedMonuments: string[];
  arViewed: string[];
  narrationPlayed: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  favorites: string[];
  tourProgress: number;
  comparedMonuments: string[][];
}

// Get user ID (can be enhanced with authentication later)
const getUserId = () => {
  return localStorage.getItem('userId') || 'default';
};

// API calls
export const api = {
  // Monuments
  getMonuments: async (): Promise<Monument[]> => {
    const response = await fetch(`${API_BASE_URL}/monuments`);
    if (!response.ok) throw new Error('Failed to fetch monuments');
    return response.json();
  },

  getMonument: async (id: string): Promise<Monument> => {
    const response = await fetch(`${API_BASE_URL}/monuments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch monument');
    return response.json();
  },

  // Quiz
  getQuizQuestions: async (): Promise<QuizQuestion[]> => {
    const response = await fetch(`${API_BASE_URL}/quiz`);
    if (!response.ok) throw new Error('Failed to fetch quiz questions');
    return response.json();
  },

  getQuizQuestionsByMonument: async (monumentId: string): Promise<QuizQuestion[]> => {
    const response = await fetch(`${API_BASE_URL}/quiz/monument/${monumentId}`);
    if (!response.ok) throw new Error('Failed to fetch quiz questions');
    return response.json();
  },

  // Achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await fetch(`${API_BASE_URL}/achievements`);
    if (!response.ok) throw new Error('Failed to fetch achievements');
    return response.json();
  },

  getAchievement: async (id: string): Promise<Achievement> => {
    const response = await fetch(`${API_BASE_URL}/achievements/${id}`);
    if (!response.ok) throw new Error('Failed to fetch achievement');
    return response.json();
  },

  // Progress
  getUserProgress: async (userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${uid}`);
    if (!response.ok) throw new Error('Failed to fetch user progress');
    return response.json();
  },

  updateUserProgress: async (progress: Partial<UserProgress>, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    });
    if (!response.ok) throw new Error('Failed to update user progress');
    return response.json();
  },

  addVisitedMonument: async (monumentId: string, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/visited/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId }),
    });
    if (!response.ok) throw new Error('Failed to add visited monument');
    return response.json();
  },

  addARViewed: async (monumentId: string, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/ar/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId }),
    });
    if (!response.ok) throw new Error('Failed to add AR viewed');
    return response.json();
  },

  addNarrationPlayed: async (monumentId: string, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/narration/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId }),
    });
    if (!response.ok) throw new Error('Failed to add narration played');
    return response.json();
  },

  updateQuizScore: async (monumentId: string, score: number, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/quiz/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId, score }),
    });
    if (!response.ok) throw new Error('Failed to update quiz score');
    return response.json();
  },

  toggleFavorite: async (monumentId: string, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/favorite/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId }),
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  },

  addAchievement: async (achievementId: string, userId?: string): Promise<UserProgress> => {
    const uid = userId || getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/achievement/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievementId }),
    });
    if (!response.ok) throw new Error('Failed to add achievement');
    return response.json();
  },
};

