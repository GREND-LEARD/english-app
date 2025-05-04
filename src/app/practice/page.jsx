'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import verbsData from '@/lib/verbs.json';
import { updateProgress } from '@/lib/progress';

// Función para obtener un verbo aleatorio FILTRADO
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
  
  if (filtered.length === 0) return null; // Manejar caso sin verbos del tipo/nivel seleccionado
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

export default function PracticePage() {
  const [currentVerb, setCurrentVerb] = useState(null);
  const [pastSimpleInput, setPastSimpleInput] = useState('');
  const [pastParticipleInput, setPastParticipleInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', correct: false, showCorrect: false });
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [practiceFilter, setPracticeFilter] = useState('all'); // Filtro de tipo (regular/irregular)
  const [practiceLevel, setPracticeLevel] = useState('all'); // Filtro de nivel de dificultad

  // Función para cargar un verbo (usada en useEffect y loadNextVerb)
  const loadVerb = useCallback((filter, level) => {
    // Resetear el verbo brevemente para forzar la animación de salida/entrada
    setCurrentVerb(null);
    // Pequeña demora para permitir la animación de salida antes de cargar el nuevo
    setTimeout(() => {
      setCurrentVerb(getRandomVerb(filter, level));
      setPastSimpleInput('');
      setPastParticipleInput('');
      setFeedback({ message: '', correct: false, showCorrect: false });
      setShowAnswer(false);
    }, 150); // 150ms de demora
  }, []);

  // Cargar el primer verbo al montar o cuando cambia el filtro o nivel
  useEffect(() => {
    loadVerb(practiceFilter, practiceLevel);
  }, [practiceFilter, practiceLevel, loadVerb]); // Depende del filtro y nivel

  // Función para verificar la respuesta
  const checkAnswer = async () => {
    if (!currentVerb) return;

    const isPastSimpleCorrect = currentVerb.forms.some(
      formSet => formSet[0].toLowerCase() === pastSimpleInput.trim().toLowerCase()
    );
    const isPastParticipleCorrect = currentVerb.forms.some(
      formSet => formSet[1].toLowerCase() === pastParticipleInput.trim().toLowerCase()
    );

    const isCorrect = isPastSimpleCorrect && isPastParticipleCorrect;

    if (isCorrect) {
      setFeedback({ message: '¡Correcto! 🎉', correct: true, showCorrect: false });
      setCorrectCount(prevCount => prevCount + 1);
    } else {
      setFeedback({ message: 'Incorrecto. Intenta de nuevo o mira la respuesta.', correct: false, showCorrect: false });
      setIncorrectCount(prevCount => prevCount + 1);
    }
    setShowAnswer(true);
    
    // Actualizar progreso en la base de datos
    try {
      await updateProgress(currentVerb.infinitive, isCorrect);
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  };

  const getCorrectAnswers = () => {
    if (!currentVerb) return { pastSimple: '', pastParticiple: '' };
    const correctPastSimple = currentVerb.forms.map(f => f[0]).join(' / ');
    const correctPastParticiple = currentVerb.forms.map(f => f[1]).join(' / ');
    return { correctPastSimple, correctPastParticiple };
  };

  const handleFilterChange = (newFilter) => {
    setPracticeFilter(newFilter);
  };

  const handleLevelChange = (newLevel) => {
    setPracticeLevel(newLevel);
  };

  // Función para pronunciar texto
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const textToSpeak = text.includes(' / ') ? text.split(' / ')[0] : text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Lo siento, tu navegador no soporta text-to-speech.");
    }
  };

  const { correctPastSimple, correctPastParticiple } = getCorrectAnswers();

  // Añadir manejo si no hay verbos para el filtro seleccionado
  // if (!currentVerb && practiceFilter !== 'all' && verbsData.some(v => v.type === practiceFilter)) {
  //   return <div className="container mx-auto p-4">Loading verb...</div>; 
  // }
  // if (!currentVerb) {
  //    return <div className="container mx-auto p-4">No verbs found for the selected filter.</div>;
  // }
  // Simplificado por ahora, asumimos que siempre hay verbos
   if (!currentVerb) {
     return <div className="container mx-auto p-4">Cargando...</div>;
   }


  return (
    <div className="container mx-auto p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Práctica de Verbos</h1>
      <div className="flex justify-center space-x-4 mb-4 text-lg">
        <span className="text-green-600 font-medium">Correctos: {correctCount}</span>
        <span className="text-red-600 font-medium">Incorrectos: {incorrectCount}</span>
      </div>

      {/* Botones de Filtro por Tipo */}
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <h3 className="text-md font-semibold mb-2 sm:mb-0 sm:mr-4">Tipo:</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded text-sm ${practiceFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterChange('regular')}
            className={`px-4 py-2 rounded text-sm ${practiceFilter === 'regular' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Regulares
          </button>
          <button
            onClick={() => handleFilterChange('irregular')}
            className={`px-4 py-2 rounded text-sm ${practiceFilter === 'irregular' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Irregulares
          </button>
        </div>
      </div>

      {/* Botones de Filtro por Nivel */}
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <h3 className="text-md font-semibold mb-2 sm:mb-0 sm:mr-4">Nivel:</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleLevelChange('all')}
            className={`px-4 py-2 rounded text-sm ${practiceLevel === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Todos
          </button>
          <button
            onClick={() => handleLevelChange('beginner')}
            className={`px-4 py-2 rounded text-sm ${practiceLevel === 'beginner' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Principiante
          </button>
          <button
            onClick={() => handleLevelChange('intermediate')}
            className={`px-4 py-2 rounded text-sm ${practiceLevel === 'intermediate' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Intermedio
          </button>
          <button
            onClick={() => handleLevelChange('advanced')}
            className={`px-4 py-2 rounded text-sm ${practiceLevel === 'advanced' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {/* Tarjeta del Verbo Animada */}
      <motion.div
        key={currentVerb ? currentVerb.infinitive : 'loading'}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentVerb ? (
          <>
            <p className="text-lg mb-2">Verbo (Infinitivo):</p>
            <div className="flex items-center justify-center mb-2">
              <p className="text-4xl font-semibold capitalize mr-3">{currentVerb.infinitive}</p>
              <button onClick={() => speak(currentVerb.infinitive)} className="text-2xl hover:scale-110 transition-transform" title="Escuchar infinitivo">🔊</button>
            </div>
            <div className="flex flex-col items-center justify-center mb-2">
              <p className="text-sm text-gray-500 mb-1 capitalize">({currentVerb.type})</p>
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
            {currentVerb.meaning_es && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <span className="font-medium">Significado:</span> {currentVerb.meaning_es}
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-gray-500">Cargando verbo...</p>
        )}
      </motion.div>

      {/* Inputs */}
      <div className="w-full max-w-md mb-6">
        <div className="mb-4">
          <label htmlFor="pastSimple" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pasado Simple:
          </label>
          <input
            id="pastSimple"
            type="text"
            value={pastSimpleInput}
            onChange={(e) => setPastSimpleInput(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full dark:bg-gray-700 dark:text-white"
            disabled={showAnswer}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pastParticiple" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Participio Pasado:
          </label>
          <input
            id="pastParticiple"
            type="text"
            value={pastParticipleInput}
            onChange={(e) => setPastParticipleInput(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full dark:bg-gray-700 dark:text-white"
            disabled={showAnswer}
          />
        </div>
      </div>

      {/* Feedback Animado */}
      {showAnswer && (
        <motion.div
          className={`p-4 rounded-lg shadow-md mb-6 w-full max-w-md ${feedback.correct ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-semibold">{feedback.message}</p>
          {!feedback.correct && (
            <div className="mt-2 text-sm">
              <p className="font-medium mb-1">Respuesta correcta:</p>
              {/* Respuesta Pasado Simple con Audio */}
              <div className="flex items-center justify-between mb-1">
                <span>Pasado Simple: <span className="font-semibold">{correctPastSimple}</span></span>
                <button
                  onClick={() => speak(correctPastSimple)}
                  className="text-lg hover:scale-110 transition-transform text-red-600 dark:text-red-300"
                  title="Escuchar pasado simple"
                >
                  🔊
                </button>
              </div>
              {/* Respuesta Pasado Participio con Audio */}
              <div className="flex items-center justify-between">
                <span>Participio Pasado: <span className="font-semibold">{correctPastParticiple}</span></span>
                 <button
                  onClick={() => speak(correctPastParticiple)}
                  className="text-lg hover:scale-110 transition-transform text-red-600 dark:text-red-300"
                  title="Escuchar participio pasado"
                >
                  🔊
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Botones */}
      <div className="flex space-x-4">
        {!showAnswer ? (
          <button
            onClick={checkAnswer}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={!pastSimpleInput || !pastParticipleInput} // Deshabilitar si los campos están vacíos
          >
            Verificar Respuesta
          </button>
        ) : (
          <button
            onClick={() => loadVerb(practiceFilter, practiceLevel)} // Usar loadVerb con el filtro y nivel actuales
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Siguiente Verbo
          </button>
        )}
      </div>

    </div>
  );
}
