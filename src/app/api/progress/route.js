import { NextResponse } from 'next/server';
import { 
  createTables,
  getUserProgress, 
  updateUserProgress, 
  updateVerbProgress,
  getVerbStats,
  getDifficultVerbs
} from '@/lib/db';

// Inicializar la base de datos (crear tablas)
createTables().catch(console.error);

// Función para obtener el ID de usuario de las cookies
function getUserIdFromCookies(request) {
  const cookies = request.headers.get('cookie') || '';
  const cookieEntries = cookies.split(';').map(c => c.trim().split('='));
  const userIdCookie = cookieEntries.find(entry => entry[0] === 'verb_master_user_id');
  return userIdCookie ? userIdCookie[1] : null;
}

// Obtener progreso del usuario
export async function GET(request) {
  try {
    const userId = getUserIdFromCookies(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo identificar al usuario. Por favor, asegúrate de tener cookies habilitadas.' },
        { status: 401 }
      );
    }
    
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let data;
    
    if (type === 'difficult') {
      // Obtener los verbos más difíciles para el usuario
      const limit = searchParams.get('limit') || 10;
      data = await getDifficultVerbs(userId, parseInt(limit));
    } else if (type === 'stats') {
      // Obtener estadísticas detalladas de los verbos
      data = await getVerbStats(userId);
    } else {
      // Obtener progreso general del usuario
      data = await getUserProgress(userId);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de progreso' },
      { status: 500 }
    );
  }
}

// Actualizar progreso del usuario
export async function POST(request) {
  try {
    const userId = getUserIdFromCookies(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo identificar al usuario. Por favor, asegúrate de tener cookies habilitadas.' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { verb, isCorrect } = body;
    
    if (!verb || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos: se requiere verbo y resultado' },
        { status: 400 }
      );
    }
    
    // Actualizar progreso general del usuario
    const userProgress = await updateUserProgress(userId, isCorrect);
    
    // Actualizar progreso específico del verbo
    const verbProgress = await updateVerbProgress(userId, verb, isCorrect);
    
    return NextResponse.json({
      success: true,
      userProgress,
      verbProgress
    });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar progreso' },
      { status: 500 }
    );
  }
} 