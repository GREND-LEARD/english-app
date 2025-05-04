import { query, updateUserProgress, updateVerbProgress, updateUserInfo } from '@/lib/db';
import { getUserId } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Endpoint para sincronizar datos del cliente con el servidor
 * Permite enviar múltiples actualizaciones en una sola solicitud
 * para minimizar las llamadas a la API
 */
export async function POST(request) {
  try {
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo identificar al usuario' },
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const { 
      userInfo,  // Información básica del usuario (nombre, nivel)
      stats,     // Estadísticas generales (si han cambiado)
      attempts,  // Array de intentos de práctica pendientes
      version    // Versión del cliente para compatibilidad
    } = await request.json();

    // Validar versión del cliente
    const supportedVersions = ['1.0', '1.1'];
    if (version && !supportedVersions.includes(version)) {
      console.warn(`Versión de cliente no compatible: ${version}`);
    }

    const updates = {};

    // 1. Actualizar información del usuario si se proporcionó
    if (userInfo && userInfo.name) {
      const level = userInfo.level || 'beginner';
      const userResult = await updateUserInfo(
        userId, 
        userInfo.name.trim(), 
        level
      );
      updates.userInfo = { updated: true, data: userResult };
    }

    // 2. Procesar intentos de práctica pendientes
    if (attempts && Array.isArray(attempts) && attempts.length > 0) {
      const processedAttempts = [];

      for (const attempt of attempts) {
        // Validar intento
        if (
          !attempt || 
          typeof attempt.verb !== 'string' || 
          typeof attempt.isCorrect !== 'boolean'
        ) {
          continue;
        }

        try {
          // Actualizar progreso general
          await updateUserProgress(userId, attempt.isCorrect);
          
          // Actualizar progreso específico del verbo
          const verbResult = await updateVerbProgress(
            userId, 
            attempt.verb, 
            attempt.isCorrect
          );
          
          processedAttempts.push({
            verb: attempt.verb,
            processed: true,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Error al procesar intento para ${attempt.verb}:`, error);
          processedAttempts.push({
            verb: attempt.verb,
            processed: false,
            error: 'Error al procesar intento'
          });
        }
      }

      updates.attempts = {
        total: attempts.length,
        processed: processedAttempts.filter(a => a.processed).length,
        items: processedAttempts
      };
    }

    // 3. Obtener datos actualizados del progreso
    const userProgressQuery = await query(
      'SELECT * FROM user_progress WHERE user_id = $1',
      [userId]
    );
    
    const userProgress = userProgressQuery.rows[0] || null;
    updates.currentProgress = userProgress;

    return NextResponse.json({
      success: true,
      message: 'Sincronización completada',
      updates
    }, { status: 200 });
  } catch (error) {
    console.error('Error en sincronización:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar datos' },
      { status: 500 }
    );
  }
} 