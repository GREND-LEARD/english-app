'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ redirectTo = '/' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clearAuthCookies = async () => {
    try {
      // Llamar al endpoint para limpiar cookies
      await fetch('/api/auth/clear-cookie');
      console.log('Cookies de autenticación limpiadas');
    } catch (err) {
      console.error('Error al limpiar cookies:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email y contraseña son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      // Primero limpiar las cookies antiguas
      await clearAuthCookies();

      // Luego intentar iniciar sesión
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Error de inicio de sesión:", result.error);
        if (result.error === 'CredentialsSignin') { 
            setError('Email o contraseña incorrectos.');
        } else {
            setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
      } else if (result?.ok) {
        console.log('Inicio de sesión exitoso');
        router.push(redirectTo);
        router.refresh(); 
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } catch (err) {
      console.error('Excepción en signIn:', err);
      setError('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Iniciar Sesión
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email-login"
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
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            id="password-login"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                      text-gray-900 dark:text-white bg-white dark:bg-gray-700
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                      placeholder-gray-400 transition-all duration-200"
            placeholder="Tu contraseña"
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
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
} 