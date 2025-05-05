import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rutas que requieren autenticación
const protectedRoutes = ['/progress'];

// La misma clave de fallback que en [...nextauth]/route.js
const FALLBACK_SECRET = "e9e1b1c2d4e2f6g3h1i8j5k3l1m5n7o9p2q3r7s6t8u9v2w4x5y8z3";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Intentar obtener el token de autenticación con opciones adicionales
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || FALLBACK_SECRET,
      cookieName: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      secureCookie: process.env.NODE_ENV === "production"
    });
    
    // Si no hay token, redirigir a la página de login
    if (!token) {
      // Prevenir redirects infinitos comprobando si ya venimos de la página de auth
      const referer = request.headers.get("referer") || "";
      if (referer.includes("/auth")) {
        // Si venimos de auth, permitir pasar para evitar bucles
        return NextResponse.next();
      }
      
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