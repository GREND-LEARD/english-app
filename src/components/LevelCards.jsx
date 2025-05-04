'use client';

import { motion } from 'framer-motion';

const LevelCards = () => {
  const levels = [
    {
      title: 'Principiante',
      description: 'Verbos comunes y básicos que todo estudiante de inglés debería conocer.',
      color: 'from-green-500 to-green-700',
      textColor: 'text-green-300',
      delay: 0.1
    },
    {
      title: 'Intermedio',
      description: 'Verbos de uso regular pero con algunas formas más complejas.',
      color: 'from-yellow-500 to-amber-700',
      textColor: 'text-yellow-300',
      delay: 0.2
    },
    {
      title: 'Avanzado',
      description: 'Verbos menos comunes o con conjugaciones más difíciles de recordar.',
      color: 'from-red-500 to-rose-700',
      textColor: 'text-red-300',
      delay: 0.3
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.7
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      className="w-full mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="mr-2">✨</span>
        Nuevo: Sistema de Niveles
      </motion.h2>
      
      <p className="text-center text-gray-300 mb-6">
        Ahora puedes practicar verbos según tu nivel de conocimiento:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <motion.div
            key={level.title}
            className="rounded-lg overflow-hidden shadow-lg bg-slate-800/70 backdrop-blur-sm"
            variants={cardVariants}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className={`w-full h-2 bg-gradient-to-r ${level.color}`} />
            <div className="p-5">
              <h3 className={`text-xl font-bold mb-2 ${level.textColor}`}>
                {level.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {level.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LevelCards; 