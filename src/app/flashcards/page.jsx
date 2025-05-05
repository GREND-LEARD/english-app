'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import verbsData from '@/lib/verbs.json';
import { updateProgress } from '@/lib/progress';

// Función para obtener verbo aleatorio filtrado por tipo y nivel
const getRandomVerb = (filter, level) => {
  let filtered = verbsData;
  
  // Filtrar por tipo (regular/irregular)
  if (filter !== 'all') {
    filtered = filtered.filter(verb => verb.type === filter);
  }
  
  // Filtrar por nivel si se especifica
  if (level !== 'all') {
    filtered = filtered.filter(verb => verb.level === level);
  }
  
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

// Función para pronunciar texto
const speak = (text) => {
  if ('speechSynthesis' in window) {
    // Si hay múltiples formas separadas por /, pronunciar la primera
    const textToSpeak = text.includes(' / ') ? text.split(' / ')[0] : text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    
    // Función para asignar una voz inglesa y hablar
    const speakWithEnglishVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => 
        voice.lang.includes('en-') || voice.lang.includes('en_')
      );
      
      // Si hay voces en inglés disponibles, usar la primera
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };
    
    // En algunos navegadores las voces se cargan de forma asíncrona
    if (window.speechSynthesis.getVoices().length) {
      speakWithEnglishVoice();
    } else {
      // Esperar a que las voces se carguen
      window.speechSynthesis.onvoiceschanged = speakWithEnglishVoice;
    }
  } else {
    alert("Lo siento, tu navegador no soporta text-to-speech.");
  }
};

export default function FlashcardsPage() {
  const [currentVerb, setCurrentVerb] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState('all'); // Filtro por tipo
  const [level, setLevel] = useState('all'); // Filtro por nivel
  const [answerResult, setAnswerResult] = useState(null); // Para registrar el resultado

  // Función para cargar un verbo
  const loadVerb = useCallback((currentFilter, currentLevel) => {
    setCurrentVerb(getRandomVerb(currentFilter, currentLevel));
    setIsFlipped(false); // Asegurarse de que la nueva tarjeta empiece por el frente
  }, []);

  // Cargar el primer verbo al montar o cuando cambia el filtro o nivel
  useEffect(() => {
    loadVerb(filter, level);
  }, [filter, level, loadVerb]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getAnswers = () => {
     if (!currentVerb) return { pastSimple: '', pastParticiple: '' };
     const pastSimple = currentVerb.forms.map(f => f[0]).join(' / ');
     const pastParticiple = currentVerb.forms.map(f => f[1]).join(' / ');
     return { pastSimple, pastParticiple };
  };

  const { pastSimple, pastParticiple } = getAnswers();

  // Función para registrar si el usuario acertó o falló
  const recordResult = async (correct) => {
    setAnswerResult(correct ? 'correct' : 'incorrect');
    
    // Registrar en la base de datos
    try {
      await updateProgress(currentVerb.infinitive, correct);
      
      // Mostrar feedback temporal
      setTimeout(() => {
        setAnswerResult(null);
        // Cargar el siguiente verbo
        loadVerb(filter, level);
      }, 800);
    } catch (error) {
      console.error('Error al guardar resultado:', error);
      setAnswerResult(null);
    }
  };

  if (!currentVerb) {
    return <div className="container mx-auto p-4 text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Tarjetas de Estudio</h1>

      {/* Filtros */}
      <div className="w-full max-w-2xl mb-6">
        {/* Botones de Filtro por Tipo */}
        <div className="flex flex-col sm:flex-row items-center mb-4">
          <h3 className="text-md font-semibold mb-2 sm:mb-0 sm:mr-4 dark:text-gray-300">Tipo:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleFilterChange('all')} 
              className={`px-4 py-2 rounded text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => handleFilterChange('regular')} 
              className={`px-4 py-2 rounded text-sm ${filter === 'regular' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Regulares
            </button>
            <button 
              onClick={() => handleFilterChange('irregular')} 
              className={`px-4 py-2 rounded text-sm ${filter === 'irregular' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Irregulares
            </button>
          </div>
        </div>
        
        {/* Botones de Filtro por Nivel */}
        <div className="flex flex-col sm:flex-row items-center">
          <h3 className="text-md font-semibold mb-2 sm:mb-0 sm:mr-4 dark:text-gray-300">Nivel:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleLevelChange('all')} 
              className={`px-4 py-2 rounded text-sm ${level === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => handleLevelChange('beginner')} 
              className={`px-4 py-2 rounded text-sm ${level === 'beginner' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Principiante
            </button>
            <button 
              onClick={() => handleLevelChange('intermediate')} 
              className={`px-4 py-2 rounded text-sm ${level === 'intermediate' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Intermedio
            </button>
            <button 
              onClick={() => handleLevelChange('advanced')} 
              className={`px-4 py-2 rounded text-sm ${level === 'advanced' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              Avanzado
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de la Tarjeta con Perspectiva para el 3D */}
      <div style={{ perspective: '1000px' }} className="mb-6">
        <motion.div
          className="relative w-80 h-64 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false} // No animar al inicio
          animate={{ rotateY: isFlipped ? 180 : 0 }} // Animar la rotación Y
          transition={{ duration: 0.6 }}
          onClick={handleFlip} // Permitir voltear haciendo clic en la tarjeta
        >
          {/* Cara Frontal */}
          <motion.div
            className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col justify-center items-center p-4 border border-gray-200 dark:border-gray-700 text-center"
            style={{ backfaceVisibility: 'hidden' }} // Ocultar cuando esté de espaldas
          >
            <div className="flex flex-col items-center mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">({currentVerb.type})</p>
              {currentVerb.level && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  currentVerb.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                  currentVerb.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {currentVerb.level === 'beginner' ? 'Principiante' : 
                   currentVerb.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center mb-3">
              <p className="text-4xl font-semibold capitalize text-gray-900 dark:text-gray-100 mr-2">{currentVerb.infinitive}</p>
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentVerb.infinitive); }}
                className="text-xl hover:scale-110 transition-transform text-gray-500 dark:text-gray-400"
                title="Escuchar infinitivo"
              >
                🔊
              </button>
            </div>
            <p className="text-base text-italic text-gray-600 dark:text-gray-300 px-2">
              {currentVerb.meaning_es || ''}
            </p>
          </motion.div>

          {/* Cara Trasera */}
          <motion.div
            className="absolute w-full h-full bg-blue-100 dark:bg-blue-900/50 rounded-lg shadow-xl flex flex-col justify-center items-center p-4 border border-blue-200 dark:border-blue-700"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} // Ocultar y rotar inicialmente
          >
            <div className="text-center mb-3">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Pasado Simple:</p>
              <div className="flex items-center justify-center">
                <p className="text-2xl font-medium text-center text-blue-900 dark:text-blue-100 mr-2">{pastSimple}</p>
                <button onClick={(e) => { e.stopPropagation(); speak(pastSimple); }} className="text-lg hover:scale-110 transition-transform text-blue-600 dark:text-blue-300" title="Escuchar pasado simple">🔊</button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Participio Pasado:</p>
              <div className="flex items-center justify-center">
                <p className="text-2xl font-medium text-center text-blue-900 dark:text-blue-100 mr-2">{pastParticiple}</p>
                <button onClick={(e) => { e.stopPropagation(); speak(pastParticiple); }} className="text-lg hover:scale-110 transition-transform text-blue-600 dark:text-blue-300" title="Escuchar participio pasado">🔊</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <button
          onClick={handleFlip}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          {isFlipped ? 'Mostrar Infinitivo' : 'Mostrar Respuesta'}
        </button>
        <button
          onClick={() => loadVerb(filter, level)}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Siguiente Tarjeta
        </button>
      </div>

      {/* Botones de Resultado (solo visibles cuando la tarjeta está volteada) */}
      {isFlipped && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => recordResult(true)}
            className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
              answerResult === 'correct' ? 'ring-4 ring-blue-300' : ''
            }`}
            disabled={answerResult !== null}
          >
            Sí lo sabía
          </button>
          <button
            onClick={() => recordResult(false)}
            className={`px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
              answerResult === 'incorrect' ? 'ring-4 ring-red-300' : ''
            }`}
            disabled={answerResult !== null}
          >
            No lo sabía
          </button>
        </div>
      )}
    </div>
  );
} 