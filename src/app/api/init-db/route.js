import { NextResponse } from 'next/server';
import { createTables } from '@/lib/db';

export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ 
      success: true, 
      message: 'Tablas de la base de datos creadas correctamente' 
    });
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al inicializar la base de datos' },
      { status: 500 }
    );
  }
} 