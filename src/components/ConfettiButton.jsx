'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const ConfettiButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const fireConfetti = () => {
    setIsAnimating(true);
    
    // Configuración básica para una explosión de confeti
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.95,
      startVelocity: 30,
      shapes: ['square', 'circle'],
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };

    // Lanzar confeti desde diferentes posiciones
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0.3, y: 0.7 }
    });
    
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0.7, y: 0.7 }
    });
    
    setTimeout(() => {
      // Lanzar un cañón de confeti desde abajo
      confetti({
        particleCount: 100,
        angle: 130,
        spread: 70,
        origin: { x: 0.9, y: 0.9 }
      });
      
      confetti({
        particleCount: 100,
        angle: 50,
        spread: 70,
        origin: { x: 0.1, y: 0.9 }
      });
    }, 250);
    
    // Restablecer animación
    setTimeout(() => setIsAnimating(false), 1000);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={fireConfetti}
        className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full shadow-lg text-white font-bold"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
        }}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <span className="text-xl">🎉</span>
      </motion.button>
    </div>
  );
};

export default ConfettiButton; 