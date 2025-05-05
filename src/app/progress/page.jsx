'use client';

import { useState, useEffect } from 'react';
import { useUserProgress, useVerbStats, useDifficultVerbs, calculateSuccessRate } from '@/lib/progress';
import verbsData from '@/lib/verbs.json';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { progress, loading: progressLoading, error: progressError } = useUserProgress();
  const { stats, loading: statsLoading, error: statsError } = useVerbStats();
  const { verbs: difficultVerbs, loading: difficultLoading } = useDifficultVerbs(5);
  const [activeTab, setActiveTab] = useState('general');

  // Redirigir si no hay sesión y se terminó de cargar
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?message=login_required&redirectTo=/progress');
    }
  }, [status, router]);

  // Si está cargando la sesión, mostrar indicador de carga
  if (status === 'loading') {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay sesión, no deberíamos llegar aquí debido a la redirección
  // pero por si acaso mostramos un mensaje de error
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Necesitas iniciar sesión</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Para ver tu progreso y estadísticas necesitas tener una cuenta e iniciar sesión.
          </p>
          <Link 
            href="/auth" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Iniciar sesión o registrarse
          </Link>
        </div>
      </div>
    );
  }

  // Función para encontrar información del verbo
  const findVerbInfo = (infinitive) => {
    return verbsData.find(v => v.infinitive.toLowerCase() === infinitive.toLowerCase());
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar estadísticas generales
  const renderGeneralStats = () => {
    if (progressLoading) return <div className="text-center py-8">Cargando estadísticas...</div>;
    if (progressError) return <div className="text-center py-8 text-red-500">Error al cargar estadísticas</div>;
    if (!progress) return <div className="text-center py-8">No hay datos de progreso disponibles</div>;

    const successRate = calculateSuccessRate(progress.correct_attempts, progress.total_attempts);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">Estadísticas Generales</h2>
        
        <div className="flex flex-col md:flex-row justify-around items-center mb-8">
          <div className="text-center mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de intentos</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progress.total_attempts}</p>
          </div>
          
          <div className="text-center mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Respuestas correctas</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{progress.correct_attempts}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tasa de aciertos</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{successRate}%</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-green-500 h-4 rounded-full" 
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Última actualización: {formatDate(progress.updated_at)}
        </div>
      </div>
    );
  };

  // Renderizar verbos difíciles
  const renderDifficultVerbs = () => {
    if (difficultLoading) return <div className="text-center py-8">Cargando verbos difíciles...</div>;
    if (!difficultVerbs || difficultVerbs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Todavía no hay suficientes datos para determinar tus verbos difíciles.
          <div className="mt-4">
            <Link href="/practice" className="text-blue-500 hover:underline">
              ¡Sigue practicando para ver resultados!
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Verbos a Mejorar</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verbo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nivel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intentos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasa de éxito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {difficultVerbs.map((verbStat) => {
                const verbInfo = findVerbInfo(verbStat.verb);
                return (
                  <tr key={verbStat.verb} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{verbStat.verb}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 capitalize">{verbInfo?.type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {verbInfo?.level && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          verbInfo.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                          verbInfo.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {verbInfo.level === 'beginner' ? 'Principiante' : 
                           verbInfo.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{verbStat.attempts}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              parseFloat(verbStat.success_rate) < 40 ? 'bg-red-500' : 
                              parseFloat(verbStat.success_rate) < 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${verbStat.success_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">{verbStat.success_rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link href="/practice" className="text-blue-500 hover:underline">
            Practicar verbos difíciles
          </Link>
        </div>
      </div>
    );
  };

  // Renderizar historial de práctica
  const renderPracticeHistory = () => {
    if (statsLoading) return <div className="text-center py-8">Cargando historial de práctica...</div>;
    if (statsError) return <div className="text-center py-8 text-red-500">Error al cargar historial</div>;
    if (!stats || stats.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Todavía no has practicado ningún verbo.
          <div className="mt-4">
            <Link href="/practice" className="text-blue-500 hover:underline">
              ¡Comienza a practicar ahora!
            </Link>
          </div>
        </div>
      );
    }

    // Ordenar por fecha más reciente
    const sortedStats = [...stats].sort((a, b) => 
      new Date(b.last_practiced) - new Date(a.last_practiced)
    );

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Historial de Práctica</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verbo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Última Práctica</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intentos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correctos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasa de Éxito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedStats.slice(0, 20).map((verbStat) => (
                <tr key={verbStat.verb} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{verbStat.verb}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(verbStat.last_practiced)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{verbStat.attempts}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{verbStat.correct}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(verbStat.success_rate) < 40 ? 'bg-red-500' : 
                            parseFloat(verbStat.success_rate) < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${verbStat.success_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{verbStat.success_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.length > 20 && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Mostrando los 20 verbos más recientes de un total de {stats.length} verbos practicados.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mi Progreso</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'general' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'difficult' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('difficult')}
        >
          Verbos Difíciles
        </button>
        <button 
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'history' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Historial
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'general' && renderGeneralStats()}
        {activeTab === 'difficult' && renderDifficultVerbs()}
        {activeTab === 'history' && renderPracticeHistory()}
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/practice" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md">
          Ir a Practicar
        </Link>
        <Link href="/flashcards" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
          Tarjetas de Estudio
        </Link>
        <Link href="/verbs" className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md">
          Lista de Verbos
        </Link>
      </div>
    </div>
  );
} 