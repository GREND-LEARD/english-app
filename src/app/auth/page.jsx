'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    }
  }, [status, router, redirectTo, messageParam]);

  return (
    <div className="container mx-auto px-4 py-12">
      {message && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
          <p className="text-center">{message}</p>
        </div>
      )}
      
      <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
        <AuthCard initialTab={messageParam === 'register_success' ? 'login' : 'signup'} redirectTo={redirectTo} />
      </div>
    </div>
  );
} 