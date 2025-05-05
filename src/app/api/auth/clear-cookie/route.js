import { NextResponse } from "next/server";

export async function GET(request) {
  // Crear una respuesta con cabeceras para eliminar las cookies
  const response = NextResponse.json({ 
    success: true, 
    message: 'Cookies de sesión eliminadas' 
  });

  // Eliminar la cookie de sesión de NextAuth
  response.cookies.delete('next-auth.session-token');
  response.cookies.delete('__Secure-next-auth.session-token');
  
  // Eliminar otras cookies relacionadas
  response.cookies.delete('next-auth.csrf-token');
  response.cookies.delete('next-auth.callback-url');
  response.cookies.delete('next-auth.pkce.code-verifier');

  return response;
} 