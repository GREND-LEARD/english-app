'use client';

import { motion } from 'framer-motion';

const AnimatedCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 12,
        delay: delay
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
      }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
      
      <motion.div
        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{
          delay: delay + 0.3,
          duration: 0.8,
          ease: 'easeOut'
        }}
      />
    </motion.div>
  );
};

export default AnimatedCard; 