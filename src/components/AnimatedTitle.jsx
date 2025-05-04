'use client';

import { motion } from 'framer-motion';

const AnimatedTitle = () => {
  // Variantes para la animación del contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Variantes para la animación del título principal
  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Variantes para la animación del subtítulo
  const subtitleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="text-center mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-4"
        variants={titleVariants}
      >
        <span>¡Bienvenido a </span>
        <motion.span 
          className="text-blue-400"
          animate={{ 
            scale: [1, 1.1, 1],
            color: ['#60a5fa', '#3b82f6', '#60a5fa'] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          Verb Master
        </motion.span>
        <span>!</span>
      </motion.h1>
      
      <motion.p 
        className="text-gray-300 mx-auto max-w-2xl"
        variants={subtitleVariants}
      >
        Tu espacio personal para dominar los verbos en inglés. Explora las listas, 
        practica con ejercicios o utiliza tarjetas de estudio.
      </motion.p>
    </motion.div>
  );
};

export default AnimatedTitle; 