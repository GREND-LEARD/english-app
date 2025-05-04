'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = () => {
  const { user, setUserName, setUserLevel, initUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [levelValue, setLevelValue] = useState('beginner');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Inicializar usuario si es necesario
  useEffect(() => {
    const currentUser = initUser();
    if (!currentUser.name) {
      setShowWelcome(true);
    }
    setNameValue(currentUser.name || '');
    setLevelValue(currentUser.level || 'beginner');
  }, [initUser]);

  const handleSave = () => {
    setUserName(nameValue.trim());
    setUserLevel(levelValue);
    setIsEditing(false);
    setShowWelcome(false);
    
    // Mostrar notificación de éxito
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Obtener el nivel en español para mostrar
  const getLevelLabel = (level) => {
    switch(level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return 'Principiante';
    }
  };

  // Componente de bienvenida para nuevos usuarios
  if (showWelcome) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
            ¡Bienvenido a Verb Master!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Para personalizar tu experiencia, por favor introduce tu nombre o apodo:
          </p>
          
          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tu nombre
            </label>
            <input
              id="userName"
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="Escribe tu nombre aquí"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
              maxLength={30}
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="userLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tu nivel de inglés
            </label>
            <select
              id="userLevel"
              value={levelValue}
              onChange={(e) => setLevelValue(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
          
          <motion.button
            onClick={handleSave}
            disabled={!nameValue.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Comenzar a Aprender
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Componente de perfil para usuarios existentes
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute top-1 right-1 left-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm py-1 px-3 rounded-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Perfil actualizado correctamente
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="profile-view"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hola,</p>
              <h3 className="font-semibold text-lg">{user.name || 'Usuario'}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getLevelLabel(levelValue)}
              </p>
            </div>
            <motion.button 
              onClick={() => {
                setIsEditing(true);
                setNameValue(user.name || '');
                setLevelValue(user.level || 'beginner');
              }}
              className="text-blue-500 hover:text-blue-700 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Editar
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="profile-edit"
          >
            <div className="mb-3">
              <label htmlFor="editName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tu nombre
              </label>
              <input
                id="editName"
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                maxLength={30}
                autoFocus
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="editLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nivel
              </label>
              <select
                id="editLevel"
                value={levelValue}
                onChange={(e) => setLevelValue(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <motion.button
                onClick={handleSave}
                disabled={!nameValue.trim()}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Guardar
              </motion.button>
              <motion.button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile; 