'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirigir después del registro

export default function RegisterForm({ redirectTo = '/' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setIsLoading(true);

    // Validación básica en cliente (opcional, ya que el backend también valida)
    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Registro exitoso
        console.log('Registro exitoso:', data.user);
        // Redirigir a la página de inicio de sesión con mensaje de éxito
        router.push(`/auth?message=register_success&redirectTo=${encodeURIComponent(redirectTo)}`);
      } else {
        // Mostrar error del backend
        setError(data.message || 'Error al registrar. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error en fetch /api/register:', err);
      setError('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Crear cuenta
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <input
            id="name-register"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       text-gray-900 dark:text-white bg-white dark:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       placeholder-gray-400 transition-all duration-200"
            placeholder="Tu Nombre"
          />
        </div>

        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email-register"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       text-gray-900 dark:text-white bg-white dark:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       placeholder-gray-400 transition-all duration-200"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            id="password-register"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       text-gray-900 dark:text-white bg-white dark:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       placeholder-gray-400 transition-all duration-200"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
                      text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200 ease-in-out"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>
    </div>
  );
} 