'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import anime from 'animejs';
import Confetti from './Confetti';

const ACHIEVEMENTS = [
  {
    id: 'first_attempt',
    title: '¡Primer Intento!',
    description: 'Completa tu primer intento de práctica',
    icon: '🎯',
    condition: (stats) => stats.totalAttempts >= 1
  },
  {
    id: 'perfect_day',
    title: 'Día Perfecto',
    description: 'Completa 10 intentos con 100% de aciertos',
    icon: '⭐',
    condition: (stats) => 
      stats.dailyStats.totalAttempts >= 10 && 
      stats.dailyStats.correctCount === stats.dailyStats.totalAttempts
  },
  {
    id: 'streak_3',
    title: 'En Racha',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    condition: (stats) => stats.streakDays >= 3
  },
  {
    id: 'streak_7',
    title: 'Maestro de la Constancia',
    description: 'Mantén una racha de 7 días',
    icon: '👑',
    condition: (stats) => stats.streakDays >= 7
  },
  {
    id: 'total_100',
    title: 'Centenario',
    description: 'Completa 100 intentos en total',
    icon: '💯',
    condition: (stats) => stats.totalAttempts >= 100
  }
];

const Achievements = () => {
  const { stats } = useStore();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const achievementsRef = useRef([]);

  useEffect(() => {
    // Verificar logros desbloqueados
    const unlocked = ACHIEVEMENTS.filter(achievement => 
      achievement.condition(stats)
    );

    // Detectar nuevos logros
    const newlyUnlocked = unlocked.filter(achievement => 
      !unlockedAchievements.some(a => a.id === achievement.id)
    );

    if (newlyUnlocked.length > 0) {
      setNewAchievement(newlyUnlocked[0]);
      setShowConfetti(true);
      
      // Animación para el nuevo logro
      anime({
        targets: `.achievement-${newlyUnlocked[0].id}`,
        scale: [0.8, 1.1, 1],
        rotate: [-5, 5, 0],
        duration: 1000,
        easing: 'easeOutElastic(1, .5)'
      });

      // Animación de partículas para el nuevo logro
      anime({
        targets: `.achievement-${newlyUnlocked[0].id} .achievement-icon`,
        scale: [1, 1.5, 1],
        rotate: [0, 360],
        duration: 1500,
        easing: 'easeOutElastic(1, .5)'
      });

      // Efecto de brillo
      anime({
        targets: `.achievement-${newlyUnlocked[0].id}`,
        boxShadow: [
          '0 0 0 rgba(255,255,255,0)',
          '0 0 20px rgba(255,255,255,0.8)',
          '0 0 0 rgba(255,255,255,0)'
        ],
        duration: 2000,
        easing: 'easeInOutQuad'
      });

      setTimeout(() => {
        setNewAchievement(null);
        setShowConfetti(false);
      }, 3000);
    }

    setUnlockedAchievements(unlocked);
  }, [stats]);

  // Animación de entrada para los logros
  useEffect(() => {
    anime({
      targets: '.achievement-card',
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutExpo'
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden">
      <Confetti trigger={showConfetti} />
      
      <motion.h2 
        className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Logros
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              ref={el => achievementsRef.current[achievement.id] = el}
              className={`
                achievement-card p-4 rounded-lg border-2 transition-all
                ${isUnlocked 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 opacity-50'
                }
                achievement-${achievement.id}
              `}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl achievement-icon">{achievement.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Notificación de nuevo logro con animación mejorada */}
      {newAchievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <motion.span 
              className="text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {newAchievement.icon}
            </motion.span>
            <div>
              <p className="font-medium">¡Nuevo Logro Desbloqueado!</p>
              <p className="text-sm">{newAchievement.title}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Achievements; 