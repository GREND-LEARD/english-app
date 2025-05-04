import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { updateProgress } from './progress';

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
        lastSyncedWithServer: null,
        dailyStats: {
          correctCount: 0,
          totalAttempts: 0
        },
        lastPracticeDate: null,
      },
      
      // Preferencias
      preferences: {
        filterType: 'all',
        filterLevel: 'all',
        theme: 'light',
        showTranslations: true,
        autoSync: true,
      },
      
      // Favoritos
      favorites: [],
      
      // Historial reciente
      recentVerbs: [],

      // Cola de sincronización pendiente
      syncQueue: [],
      
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
      
      // Registrar intento de práctica - ahora con sincronización opcional con el servidor
      recordAttempt: (isCorrect, verb) => {
        const now = new Date().toISOString();
        const { preferences, syncToServer } = get();
        
        // Actualizar estadísticas
        set(state => ({
          stats: {
            ...state.stats,
            correctCount: isCorrect ? state.stats.correctCount + 1 : state.stats.correctCount,
            incorrectCount: !isCorrect ? state.stats.incorrectCount + 1 : state.stats.incorrectCount,
            totalAttempts: state.stats.totalAttempts + 1,
            dailyStats: {
              correctCount: state.stats.dailyStats.correctCount + (isCorrect ? 1 : 0),
              totalAttempts: state.stats.dailyStats.totalAttempts + 1
            },
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
          
          // Sincronizar con el servidor si está activado
          if (preferences.autoSync) {
            // Enviar la actualización al servidor y manejar errores
            updateProgress(verb, isCorrect)
              .then(() => {
                set(state => ({
                  stats: {
                    ...state.stats,
                    lastSyncedWithServer: now
                  }
                }));
              })
              .catch(error => {
                console.error('Error al sincronizar con el servidor:', error);
                // Añadir a la cola de sincronización para reintentar después
                set(state => ({
                  syncQueue: [...state.syncQueue, { verb, isCorrect, timestamp: now }]
                }));
              });
          } else {
            // Añadir a la cola para sincronización manual posterior
            set(state => ({
              syncQueue: [...state.syncQueue, { verb, isCorrect, timestamp: now }]
            }));
          }
        }
      },
      
      // Sincronizar datos pendientes con el servidor
      syncWithServer: async () => {
        const { syncQueue } = get();
        if (syncQueue.length === 0) return;
        
        // Copiar la cola actual y limpiarla para evitar duplicados
        const currentQueue = [...syncQueue];
        set({ syncQueue: [] });
        
        // Procesar cada elemento de la cola
        const now = new Date().toISOString();
        let allSuccess = true;
        
        for (const item of currentQueue) {
          try {
            await updateProgress(item.verb, item.isCorrect);
          } catch (error) {
            console.error('Error al sincronizar item:', item, error);
            allSuccess = false;
            // Devolver el item a la cola
            set(state => ({
              syncQueue: [...state.syncQueue, item]
            }));
          }
        }
        
        if (allSuccess) {
          set(state => ({
            stats: {
              ...state.stats,
              lastSyncedWithServer: now
            }
          }));
        }
        
        return allSuccess;
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
            streakDays: 0,
            lastSyncedWithServer: null,
            dailyStats: {
              correctCount: 0,
              totalAttempts: 0
            },
            lastPracticeDate: null,
          }
        });
      },

      // Actualizar racha
      updateStreak: () => {
        const now = new Date();
        const { stats } = get();
        
        if (stats.lastPracticeDate) {
          const lastDate = new Date(stats.lastPracticeDate);
          const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Día consecutivo
            set(state => ({
              stats: {
                ...state.stats,
                streakDays: state.stats.streakDays + 1
              }
            }));
          } else if (daysDiff > 1) {
            // Se rompió la racha
            set(state => ({
              stats: {
                ...state.stats,
                streakDays: 1
              }
            }));
          }
        } else {
          // Primera práctica
          set(state => ({
            stats: {
              ...state.stats,
              streakDays: 1
            }
          }));
        }

        set(state => ({
          stats: {
            ...state.stats,
            lastPracticeDate: now.toISOString()
          }
        }));
      },

      // Reiniciar estadísticas diarias
      resetDailyStats: () => {
        set(state => ({
          stats: {
            ...state.stats,
            dailyStats: {
              correctCount: 0,
              totalAttempts: 0
            }
          }
        }));
      },

      // Sincronización
      addToSyncQueue: (action) => {
        const { syncQueue } = get();
        set({ syncQueue: [...syncQueue, { ...action, timestamp: Date.now() }] });
      },

      clearSyncQueue: () => set({ syncQueue: [] }),

      // Sincronizar con el servidor
      syncWithServer: async () => {
        const { syncQueue, user, stats, isOnline } = get();
        
        if (!isOnline || syncQueue.length === 0) return;

        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userInfo: user,
              stats,
              attempts: syncQueue,
              version: '1.1'
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              set({ syncQueue: [] });
            }
          }
        } catch (error) {
          console.error('Error al sincronizar:', error);
        }
      },

      // Actualizar estado de conexión
      setOnlineStatus: (status) => set({ isOnline: status }),
    }),
    {
      name: 'verb-master-storage', // Nombre para localStorage
      storage: createJSONStorage(() => localStorage), // Especificar explícitamente localStorage
      partialize: (state) => ({
        user: state.user,
        stats: state.stats,
        preferences: state.preferences,
        favorites: state.favorites,
        recentVerbs: state.recentVerbs.slice(0, 20),
        syncQueue: state.syncQueue
      })
    }
  )
); 