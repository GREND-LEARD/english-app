import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser } from '@/lib/db'; // Asumiendo que tienes alias '@' configurado para src

// Puedes ajustar la fuerza del hasheo (salt rounds). 10-12 es común.
const saltRounds = 10;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validación básica de entrada
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nombre, email y contraseña son requeridos.' }, { status: 400 });
    }
    
    // Validar formato de email (simple)
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ message: 'Formato de email inválido.' }, { status: 400 });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) { // Puedes ajustar este mínimo
      return NextResponse.json({ message: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Intentar crear el usuario en la base de datos
    try {
      const newUser = await createUser(name, email, hashedPassword);
      console.log('Usuario creado:', newUser);
      // No devolver la contraseña hasheada
      return NextResponse.json({ message: 'Usuario registrado con éxito.', user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });
      
    } catch (error) {
      // Manejar error específico de email duplicado desde db.js
      if (error.message === 'El email ya está registrado.') {
        return NextResponse.json({ message: 'Este email ya está en uso.' }, { status: 409 }); // 409 Conflict
      }
      // Otros errores de base de datos o inesperados
      console.error('Error al registrar usuario (API):', error);
      return NextResponse.json({ message: 'Error al registrar el usuario.' }, { status: 500 });
    }

  } catch (error) {
    // Error al parsear el JSON del body u otro error general
    console.error('Error en POST /api/register:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
} 