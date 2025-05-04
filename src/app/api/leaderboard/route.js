import { query } from '@/lib/db';
import { getUserId } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Obtener datos del leaderboard
export async function GET(request) {
  try {
    // Obtener el límite de resultados (opcional)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 10;
    
    // Consulta SQL para obtener leaderboard
    const leaderboardQuery = `
      SELECT 
        up.user_id as id,
        up.user_name as name,
        up.user_level as level,
        up.correct_attempts as correctCount,
        up.total_attempts as totalAttempts,
        ROUND((up.correct_attempts::NUMERIC / NULLIF(up.total_attempts, 0)) * 100, 2) as successRate
      FROM 
        user_progress up
      WHERE 
        up.total_attempts > 0 AND
        up.user_name IS NOT NULL
      ORDER BY 
        successRate DESC, 
        total_attempts DESC
      LIMIT $1
    `;
    
    // Ejecutar la consulta
    const result = await query(leaderboardQuery, [limit]);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener leaderboard' },
      { status: 500 }
    );
  }
}

// POST: Actualizar o establecer nombre de usuario
export async function POST(request) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { name } = await request.json();
    
    // Validar datos
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nombre de usuario requerido' },
        { status: 400 }
      );
    }
    
    // Obtener ID de usuario
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo identificar al usuario' },
        { status: 401 }
      );
    }
    
    // Actualizar nombre de usuario en la base de datos
    const updateQuery = `
      UPDATE user_progress
      SET user_name = $1
      WHERE user_id = $2
      RETURNING *
    `;
    
    const result = await query(updateQuery, [name.trim(), userId]);
    
    // Si no se encontró el usuario, crearlo
    if (result.rowCount === 0) {
      const insertQuery = `
        INSERT INTO user_progress (user_id, user_name)
        VALUES ($1, $2)
        RETURNING *
      `;
      
      const insertResult = await query(insertQuery, [userId, name.trim()]);
      return NextResponse.json(insertResult.rows[0], { status: 201 });
    }
    
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al actualizar nombre de usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar nombre de usuario' },
      { status: 500 }
    );
  }
} 