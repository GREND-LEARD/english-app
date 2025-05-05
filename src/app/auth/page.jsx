'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthCard from '@/components/AuthCard';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('');
  
  const redirectTo = searchParams.get('redirectTo') || '/';
  const messageParam = searchParams.get('message');

  useEffect(() => {
    // Si el usuario ya tiene sesión, redirigir
    if (status === 'authenticated') {
      router.push(redirectTo);
    }
    
    // Mostrar mensaje según el parámetro en la URL
    if (messageParam === 'login_required') {
      setMessage('Necesitas iniciar sesión para acceder a esa área.');
    } else if (messageParam === 'register_success') {
      setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
    } else {
      setMessage(''); // Limpiar mensaje si no hay parámetro relevante
    }
  }, [status, router, redirectTo, messageParam]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Elementos decorativos */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-blue-400/20 dark:bg-blue-500/10 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-40 right-20 w-72 h-72 bg-purple-400/20 dark:bg-purple-500/10 rounded-full filter blur-3xl z-0"></div>
      
      {/* Texto Introductorio */}
      <motion.div 
        className="text-center mb-10 max-w-2xl mx-auto relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Bienvenido a <span className="text-indigo-600 dark:text-indigo-400">Verb Master</span>!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Regístrate o inicia sesión para guardar tu progreso, seguir tus estadísticas 
          y convertirte en un maestro de los verbos en inglés.
        </p>
      </motion.div>
      
      {/* Mensaje (si existe) */}
      {message && (
        <motion.div 
          className="max-w-md mx-auto mb-8 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-center font-medium">{message}</p>
        </motion.div>
      )}
      
      {/* Tarjeta de Autenticación */}
      <motion.div 
        className="flex justify-center items-start relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <AuthCard 
            // Determinar qué lado mostrar inicialmente basado en el mensaje
            initialTab={messageParam === 'register_success' ? 'login' : 'login'} 
            redirectTo={redirectTo} 
          />
        </div>
      </motion.div>
      
      {/* Información adicional */}
      <motion.div 
        className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p>Al registrarte, aceptas nuestros términos y condiciones. Tus datos estarán seguros y nunca serán compartidos.</p>
      </motion.div>
    </div>
  );
} 