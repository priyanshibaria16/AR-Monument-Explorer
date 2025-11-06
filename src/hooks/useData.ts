import { useState, useEffect } from 'react';
import { api, type Monument, type QuizQuestion, type Achievement, type UserProgress } from '@/lib/api';

export function useMonuments() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        setLoading(true);
        const data = await api.getMonuments();
        setMonuments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch monuments'));
        console.error('Error fetching monuments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonuments();
  }, []);

  return { monuments, loading, error };
}

export function useQuizQuestions(monumentId?: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = monumentId 
          ? await api.getQuizQuestionsByMonument(monumentId)
          : await api.getQuizQuestions();
        setQuestions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch quiz questions'));
        console.error('Error fetching quiz questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [monumentId]);

  return { questions, loading, error };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await api.getAchievements();
        setAchievements(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch achievements'));
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return { achievements, loading, error };
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await api.getUserProgress();
        setProgress(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user progress'));
        console.error('Error fetching user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const refreshProgress = async () => {
    try {
      const data = await api.getUserProgress();
      setProgress(data);
    } catch (err) {
      console.error('Error refreshing progress:', err);
    }
  };

  return { progress, loading, error, refreshProgress };
}

