'use client';

import { useState } from 'react';
import verbsData from '@/lib/verbs.json';

export default function VerbsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState('all');

  const filteredVerbs = verbsData.filter(verb => {
    const searchMatch = verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = activeTypeFilter === 'all' || verb.type === activeTypeFilter;
    const levelMatch = activeLevelFilter === 'all' || verb.level === activeLevelFilter;
    return searchMatch && typeMatch && levelMatch;
  });

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Lista de Verbos en Inglés</h1>

      <div className="flex flex-col gap-4 mb-6">
        {/* Barra de búsqueda */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Buscar verbo..."
            className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded w-full md:w-1/3 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredVerbs.length} verbos encontrados
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtros por tipo */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTypeFilter('all')}
                className={`px-4 py-2 rounded text-sm ${activeTypeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTypeFilter('regular')}
                className={`px-4 py-2 rounded text-sm ${activeTypeFilter === 'regular' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Regulares
              </button>
              <button
                onClick={() => setActiveTypeFilter('irregular')}
                className={`px-4 py-2 rounded text-sm ${activeTypeFilter === 'irregular' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Irregulares
              </button>
            </div>
          </div>

          {/* Filtros por nivel */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nivel:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLevelFilter('all')}
                className={`px-4 py-2 rounded text-sm ${activeLevelFilter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveLevelFilter('beginner')}
                className={`px-4 py-2 rounded text-sm ${activeLevelFilter === 'beginner' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Principiante
              </button>
              <button
                onClick={() => setActiveLevelFilter('intermediate')}
                className={`px-4 py-2 rounded text-sm ${activeLevelFilter === 'intermediate' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Intermedio
              </button>
              <button
                onClick={() => setActiveLevelFilter('advanced')}
                className={`px-4 py-2 rounded text-sm ${activeLevelFilter === 'advanced' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
              >
                Avanzado
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Infinitivo</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Pasado Simple</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Participio Pasado</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nivel</th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Significado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredVerbs.map((verb) => (
              verb.forms.map((formSet, index) => (
                <tr key={`${verb.infinitive}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {index === 0 ? verb.infinitive : ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{formSet[0]}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{formSet[1]}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 capitalize whitespace-nowrap">
                    {index === 0 ? verb.type : ''}
                  </td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    {index === 0 && verb.level ? (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        verb.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                        verb.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {verb.level === 'beginner' ? 'Principiante' : 
                         verb.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    ) : ''}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 whitespace-normal">
                    {index === 0 ? verb.meaning_es || '-' : ''}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}