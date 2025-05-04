import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        ¡Bienvenido a <span className="text-blue-600 dark:text-blue-400">Verb Master</span>!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl text-center">
        Tu espacio personal para dominar los verbos en inglés. Explora las listas, practica con ejercicios o utiliza tarjetas de estudio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link href="/verbs" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Lista de Verbos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Navega y busca verbos regulares e irregulares.
          </p>
        </Link>

        <Link href="/practice" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400">
          <h2 className="text-2xl font-semibold mb-3 text-green-700 dark:text-green-300">✏️ Modo Práctica</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Pon a prueba tus conocimientos completando las formas verbales.
          </p>
        </Link>

        <Link href="/flashcards" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400">
          <h2 className="text-2xl font-semibold mb-3 text-purple-700 dark:text-purple-300">🔄 Tarjetas de Estudio</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Usa tarjetas interactivas para memorizar verbos eficazmente.
          </p>
        </Link>
      </div>
      
      <div className="mt-6 w-full max-w-4xl">
        <Link href="/progress" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400">
          <h2 className="text-2xl font-semibold mb-3 text-orange-700 dark:text-orange-300">📊 Mi Progreso</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualiza tus estadísticas, verbos difíciles e historial de práctica.
          </p>
        </Link>
      </div>
      
      <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">✨ Nuevo: Sistema de Niveles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ahora puedes practicar verbos según tu nivel de conocimiento:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Principiante</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos comunes y básicos que todo estudiante de inglés debería conocer.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Intermedio</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos de uso regular pero con algunas formas más complejas.
            </p>
          </div>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Avanzado</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbos menos comunes o con conjugaciones más difíciles de recordar.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        ¡Feliz aprendizaje!
      </footer>
    </div>
  );
}
