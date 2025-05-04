'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

// Datos de ejemplo para el leaderboard
// En una implementación real, estos datos vendrían de la base de datos
const MOCK_LEADERBOARD_DATA = [
  { id: 'user1', name: 'Ana', correctCount: 245, totalAttempts: 278, level: 'advanced' },
  { id: 'user2', name: 'Carlos', correctCount: 187, totalAttempts: 215, level: 'intermediate' },
  { id: 'user3', name: 'Elena', correctCount: 167, totalAttempts: 201, level: 'beginner' },
  { id: 'user4', name: 'Roberto', correctCount: 145, totalAttempts: 180, level: 'intermediate' },
  { id: 'user5', name: 'María', correctCount: 132, totalAttempts: 150, level: 'advanced' },
];

const Leaderboard = () => {
  const { user } = useStore();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  
  useEffect(() => {
    // Simular carga de datos de leaderboard
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        // En una implementación real, esto sería una llamada a la API
        // await fetch('/api/leaderboard') ...
        
        // Por ahora usamos datos de ejemplo
        setTimeout(() => {
          // Agregar el usuario actual a los datos del leaderboard
          const stats = useStore.getState().stats;
          
          // Solo agregar el usuario si tiene un nombre y ha realizado intentos
          let updatedData = [...MOCK_LEADERBOARD_DATA];
          if (user.name && stats.totalAttempts > 0) {
            const userData = {
              id: user.id,
              name: user.name,
              correctCount: stats.correctCount,
              totalAttempts: stats.totalAttempts,
              level: user.level,
            };
            
            // Verificar si el usuario ya está en la lista
            const existingUserIndex = updatedData.findIndex(item => item.id === user.id);
            if (existingUserIndex >= 0) {
              updatedData[existingUserIndex] = userData;
            } else {
              updatedData.push(userData);
            }
          }
          
          // Ordenar por porcentaje de aciertos
          updatedData = updatedData.map(item => ({
            ...item,
            successRate: Math.round((item.correctCount / Math.max(item.totalAttempts, 1)) * 100)
          })).sort((a, b) => b.successRate - a.successRate);
          
          // Determinar el rango del usuario actual
          const currentUserRank = updatedData.findIndex(item => item.id === user.id) + 1;
          setUserRank(currentUserRank > 0 ? currentUserRank : null);
          
          setLeaderboardData(updatedData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar leaderboard:', error);
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [user.id, user.name, user.level]);
  
  // Función para obtener la clase de medalla según la posición
  const getMedalClass = (index) => {
    switch(index) {
      case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 1: return 'bg-gray-100 text-gray-800 border-gray-300';
      case 2: return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-white text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono de medalla según la posición
  const getMedalIcon = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}`;
    }
  };
  
  // Función para obtener la etiqueta de nivel en español
  const getLevelLabel = (level) => {
    switch(level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return 'Principiante';
    }
  };
  
  // Mostrar spinner durante la carga
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Tabla de Clasificación</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando clasificación...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Tabla de Clasificación</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Compite con otros estudiantes y mejora tu posición
      </p>
      
      {userRank && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Tu posición actual: <span className="font-bold">{userRank}º</span> de {leaderboardData.length} usuarios
          </p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pos.</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nivel</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aciertos</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboardData.map((item, index) => {
              const isCurrentUser = item.id === user.id;
              
              return (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} 
                    transition-colors
                  `}
                >
                  <td className="px-3 py-2.5">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getMedalClass(index)}`}>
                      {getMedalIcon(index)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center">
                      <span className={`text-sm ${isCurrentUser ? 'font-bold text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.name}
                        {isCurrentUser && <span className="text-xs ml-2 text-blue-500">(Tú)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      item.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                      item.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {getLevelLabel(item.level)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                    {item.correctCount} / {item.totalAttempts}
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    <div className="flex items-center">
                      <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.successRate < 40 ? 'bg-red-500' : 
                            item.successRate < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{item.successRate}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sigue practicando para mejorar tu puntuación y subir en la clasificación
        </p>
      </div>
    </div>
  );
};

export default Leaderboard; 