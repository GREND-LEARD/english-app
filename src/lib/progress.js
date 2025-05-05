import { useState, useEffect, useCallback } from 'react';
import { getUserId } from './auth';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Hook para obtener el progreso general del usuario
export function useUserProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress');
      if (!response.ok) {
        throw new Error('Error al obtener progreso');
      }
      const data = await response.json();
      setProgress(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refreshProgress: fetchProgress };
}

// Hook para obtener estadísticas detalladas de verbos
export function useVerbStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress?type=stats');
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching verb stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refreshStats: fetchStats };
}

// Hook para obtener los verbos más difíciles
export function useDifficultVerbs(limit = 10) {
  const [verbs, setVerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDifficultVerbs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/progress?type=difficult&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al obtener verbos difíciles');
      }
      const data = await response.json();
      setVerbs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching difficult verbs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchDifficultVerbs();
  }, [fetchDifficultVerbs]);

  return { verbs, loading, error, refreshVerbs: fetchDifficultVerbs };
}

// Función para actualizar el progreso después de practicar
export async function updateProgress(verb, isCorrect) {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        verb,
        isCorrect,
      }),
    });

    if (response.status === 401) {
      // Si no está autenticado, devolvemos un objeto especial indicando esto
      return { requiresAuth: true, success: false };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar progreso');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
}

// Hook para usar el progreso actualizado con manejo de autenticación
export function useProgressUpdate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (verb, isCorrect) => {
    if (status === 'loading') return { success: false, waiting: true };
    
    setIsUpdating(true);
    setError(null);
    
    try {
      const result = await updateProgress(verb, isCorrect);
      
      // Si el resultado indica que se requiere autenticación
      if (result.requiresAuth) {
        // Redirigir a la página de inicio de sesión
        router.push(`/auth?message=login_required&redirectTo=${encodeURIComponent(window.location.pathname)}`);
        return { success: false, requiresAuth: true };
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  }, [router, status]);

  return { update, isUpdating, error };
}

// Función para calcular tasas de éxito
export function calculateSuccessRate(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
} 