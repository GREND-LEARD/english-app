import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Store principal de la aplicación
export const useStore = create(
  persist(
    (set, get) => ({
      // Estado del usuario
      user: {
        id: null,
        name: '',
        level: 'beginner',
        created: null,
      },
      
      // Estadísticas
      stats: {
        correctCount: 0,
        incorrectCount: 0,
        totalAttempts: 0,
        lastPracticed: null,
        streakDays: 0,
      },
      
      // Preferencias
      preferences: {
        filterType: 'all',
        filterLevel: 'all',
        theme: 'light',
        showTranslations: true,
      },
      
      // Favoritos
      favorites: [],
      
      // Historial reciente
      recentVerbs: [],
      
      // Inicializar usuario si no existe
      initUser: () => {
        const { user } = get();
        if (!user.id) {
          set({
            user: {
              id: uuidv4(),
              name: '',
              level: 'beginner',
              created: new Date().toISOString(),
            }
          });
        }
        return get().user;
      },
      
      // Actualizar nombre de usuario
      setUserName: (name) => {
        set(state => ({
          user: { ...state.user, name }
        }));
      },
      
      // Actualizar nivel de usuario
      setUserLevel: (level) => {
        set(state => ({
          user: { ...state.user, level }
        }));
      },
      
      // Actualizar preferencias
      setPreference: (key, value) => {
        set(state => ({
          preferences: { ...state.preferences, [key]: value }
        }));
      },
      
      // Registrar intento de práctica
      recordAttempt: (isCorrect, verb) => {
        const now = new Date().toISOString();
        
        // Actualizar estadísticas
        set(state => ({
          stats: {
            ...state.stats,
            correctCount: isCorrect ? state.stats.correctCount + 1 : state.stats.correctCount,
            incorrectCount: !isCorrect ? state.stats.incorrectCount + 1 : state.stats.incorrectCount,
            totalAttempts: state.stats.totalAttempts + 1,
            lastPracticed: now
          }
        }));
        
        // Actualizar verbos recientes
        if (verb) {
          set(state => {
            const recentVerbs = [
              { verb, timestamp: now, correct: isCorrect },
              ...state.recentVerbs.filter(item => item.verb !== verb).slice(0, 9)
            ];
            return { recentVerbs };
          });
        }
      },
      
      // Añadir/quitar verbo de favoritos
      toggleFavorite: (verb) => {
        set(state => {
          const isFavorite = state.favorites.includes(verb);
          const favorites = isFavorite
            ? state.favorites.filter(v => v !== verb)
            : [...state.favorites, verb];
          return { favorites };
        });
      },
      
      // Verificar si un verbo es favorito
      isFavorite: (verb) => {
        return get().favorites.includes(verb);
      },
      
      // Reiniciar estadísticas
      resetStats: () => {
        set({
          stats: {
            correctCount: 0,
            incorrectCount: 0,
            totalAttempts: 0,
            lastPracticed: null,
            streakDays: 0
          }
        });
      }
    }),
    {
      name: 'verb-master-storage', // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        stats: state.stats,
        preferences: state.preferences,
        favorites: state.favorites,
        recentVerbs: state.recentVerbs.slice(0, 20)
      })
    }
  )
); 