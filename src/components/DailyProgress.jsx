'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import anime from 'animejs';

const DailyProgress = () => {
  const { stats } = useStore();
  const [streakAnimation, setStreakAnimation] = useState(false);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);

  // Calcular porcentaje de éxito
  const successRate = stats.totalAttempts > 0 
    ? Math.round((stats.correctCount / stats.totalAttempts) * 100) 
    : 0;

  // Efecto para animar la racha cuando cambia
  useEffect(() => {
    if (stats.streakDays > 0) {
      setStreakAnimation(true);
      const timer = setTimeout(() => setStreakAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [stats.streakDays]);

  // Animación del contador
  useEffect(() => {
    if (counterRef.current) {
      anime({
        targets: counterRef.current,
        innerHTML: [0, stats.correctCount],
        round: 1,
        duration: 1500,
        easing: 'easeOutExpo'
      });
    }
  }, [stats.correctCount]);

  // Animación de la barra de progreso
  useEffect(() => {
    if (progressBarRef.current) {
      anime({
        targets: progressBarRef.current,
        width: `${successRate}%`,
        duration: 1500,
        easing: 'easeOutExpo',
        backgroundColor: [
          { value: '#EF4444' }, // red-500
          { value: '#F59E0B' }, // amber-500
          { value: '#10B981' }  // emerald-500
        ],
        direction: 'alternate'
      });
    }
  }, [successRate]);

  // Animación de la racha
  useEffect(() => {
    if (streakAnimation) {
      anime({
        targets: '.streak-icon',
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        duration: 1000,
        easing: 'easeInOutQuad'
      });
    }
  }, [streakAnimation]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <motion.h2 
        className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tu Progreso Diario
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta de Aciertos */}
        <motion.div 
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Aciertos Hoy
          </h3>
          <p 
            ref={counterRef}
            className="text-2xl font-bold text-blue-600 dark:text-blue-300"
          >
            {stats.correctCount}
          </p>
        </motion.div>

        {/* Tarjeta de Tasa de Éxito */}
        <motion.div 
          className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Tasa de Éxito
          </h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">
              {successRate}%
            </p>
            <div className="ml-2 w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                ref={progressBarRef}
                className="h-full rounded-full"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tarjeta de Racha */}
        <motion.div 
          className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
          animate={streakAnimation ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Racha Actual
          </h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {stats.streakDays}
            </p>
            <span className="ml-2 text-purple-500 streak-icon">🔥</span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            {stats.streakDays > 0 ? '¡Sigue así!' : '¡Comienza tu racha!'}
          </p>
        </motion.div>
      </div>

      {/* Mensaje motivacional con animación */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stats.totalAttempts > 0 
            ? '¡Excelente trabajo! Sigue practicando para mejorar.'
            : '¡Comienza tu práctica hoy!'}
        </p>
      </motion.div>
    </div>
  );
};

export default DailyProgress; 