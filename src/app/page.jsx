'use client'; // Necesario para Framer Motion

import Link from 'next/link';
import { motion } from 'framer-motion'; // Importar motion

export default function Home() {

  // Variantes para animación stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Retraso entre hijos
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 100 } 
    }
  };

  return (
    // Contenedor principal con padding ajustado y min-height
    <motion.div 
      className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants} // Aplicar variantes de contenedor
    >
      {/* Título Animado */}
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center"
        variants={itemVariants} // Aplicar variantes de item
      >
        ¡Bienvenido a <span className="text-blue-600 dark:text-blue-400">Verb Master</span>!
      </motion.h1>
      
      {/* Párrafo Animado */}
      <motion.p 
        className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl text-center"
        variants={itemVariants}
      >
        Tu espacio personal para dominar los verbos en inglés. Explora las listas, practica con ejercicios o utiliza tarjetas de estudio.
      </motion.p>

      {/* Grid principal Animado (como contenedor stagger) */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-5xl mb-10"
        variants={containerVariants} // Usa variantes de contenedor para stagger
        initial="hidden"
        animate="visible"
      >
        {/* Tarjeta Lista de Verbos Animada */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link href="/verbs" className="block h-full p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
            <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span role="img" aria-label="books icon">📚</span> Lista de Verbos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Navega y busca verbos regulares e irregulares.
            </p>
          </Link>
        </motion.div>

        {/* Tarjeta Modo Práctica Animada */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link href="/practice" className="block h-full p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400">
            <h2 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300 flex items-center gap-2">
              <span role="img" aria-label="pencil icon">✏️</span> Modo Práctica
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pon a prueba tus conocimientos completando las formas verbales.
            </p>
          </Link>
        </motion.div>

        {/* Tarjeta Tarjetas de Estudio Animada */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link href="/flashcards" className="block h-full p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400">
            <h2 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <span role="img" aria-label="refresh icon">🔄</span> Tarjetas de Estudio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Usa tarjetas interactivas para memorizar verbos eficazmente.
            </p>
          </Link>
        </motion.div>
        
        {/* Tarjeta Mi Progreso Animada */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link href="/progress" className="block h-full p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400">
            <h2 className="text-xl font-semibold mb-3 text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <span role="img" aria-label="chart icon">📊</span> Mi Progreso
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visualiza tus estadísticas, verbos difíciles e historial de práctica.
            </p>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Sección Sistema de Niveles Animada */}
      <motion.div 
        className="mt-10 p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-5xl"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
           <span role="img" aria-label="star sparkle icon">✨</span> Nuevo: Sistema de Niveles
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ahora puedes practicar verbos según tu nivel de conocimiento:
        </p>
        
        {/* Grid interno de niveles (revertido) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Nivel Principiante */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Principiante</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos comunes y básicos que todo estudiante de inglés debería conocer.
            </p>
          </div>
          
          {/* Nivel Intermedio */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Intermedio</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos de uso regular pero con algunas formas más complejas.
            </p>
          </div>
          
          {/* Nivel Avanzado */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Avanzado</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos menos comunes o con conjugaciones más difíciles de recordar.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Animado */}
      <motion.footer 
        className="mt-12 text-sm text-gray-500 dark:text-gray-400"
        variants={itemVariants}
      >
        ¡Feliz aprendizaje!
      </motion.footer>
    </motion.div>
  );
}
