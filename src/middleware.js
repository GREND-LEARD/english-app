import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rutas que requieren autenticación
const protectedRoutes = ['/progress'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Intentar obtener el token de autenticación
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Si no hay token, redirigir a la página de login
    if (!token) {
      const url = new URL('/auth', request.url);
      // Añadir parametros para mostrar mensaje y guardar la URL de redirección
      url.searchParams.set('message', 'login_required');
      url.searchParams.set('redirectTo', pathname);
      
      return NextResponse.redirect(url);
    }
  }
  
  // Si no es una ruta protegida o el usuario está autenticado, continuar
  return NextResponse.next();
}

// Configurar el middleware para que solo se ejecute en las rutas necesarias
export const config = {
  matcher: [
    // Rutas protegidas
    '/progress/:path*',
    // Otras rutas que quieras proteger en el futuro
    // '/profile/:path*',
    // '/settings/:path*',
  ],
}; 