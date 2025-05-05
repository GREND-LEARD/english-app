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
      const result = await signIn('credentials', {
        redirect: false, // No redirigir automáticamente, manejaremos la respuesta
        email,
        password,
      });

      if (result?.error) {
        // Manejar errores específicos devueltos por la función authorize
        // (o errores generales de NextAuth)
        console.error("Error de inicio de sesión:", result.error);
        if (result.error === 'CredentialsSignin') { // Error común de credenciales inválidas
            setError('Email o contraseña incorrectos.');
        } else {
            setError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
      } else if (result?.ok) {
        // Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso');
        // Redirigir a la página principal o al dashboard o a donde especifique redirectTo
        router.push(redirectTo);
        router.refresh(); // Opcional: refresca la página para asegurar que el estado del layout se actualice
      } else {
        // Caso inesperado
        setError('Ocurrió un error inesperado.');
      }
    } catch (err) {
      // Error de red o excepción inesperada
      console.error('Excepción en signIn:', err);
      setError('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Iniciar Sesión</h2>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          placeholder="Tu contraseña"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
        >
          {isLoading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </div>
      {/* Enlace para ir a la página de registro - No necesario en AuthCard, se puede eliminar si se usa dentro de AuthCard */}
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <a href="/auth" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Regístrate</a>
      </p>
    </form>
  );
} 