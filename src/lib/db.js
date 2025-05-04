import { Pool } from 'pg';

// Configuración de la conexión a Neon DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para ejecutar consultas
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta ejecutada', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error en consulta a la base de datos:', error);
    throw error;
  }
}

// Función para crear las tablas necesarias
export async function createTables() {
  const createUserProgressTable = `
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      total_attempts INTEGER DEFAULT 0,
      correct_attempts INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createVerbProgressTable = `
    CREATE TABLE IF NOT EXISTS verb_progress (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      verb TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      correct INTEGER DEFAULT 0,
      last_practiced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, verb)
    )
  `;

  try {
    await query(createUserProgressTable, []);
    await query(createVerbProgressTable, []);
    console.log('Tablas creadas correctamente');
  } catch (error) {
    console.error('Error al crear tablas:', error);
  }
}

// Función para obtener o crear perfil de progreso del usuario
export async function getUserProgress(userId) {
  try {
    // Intentar obtener el progreso del usuario
    const userResult = await query(
      'SELECT * FROM user_progress WHERE user_id = $1',
      [userId]
    );

    // Si no existe, crear un nuevo registro
    if (userResult.rows.length === 0) {
      const newUserResult = await query(
        'INSERT INTO user_progress (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
      return newUserResult.rows[0];
    }

    return userResult.rows[0];
  } catch (error) {
    console.error('Error al obtener progreso del usuario:', error);
    throw error;
  }
}

// Actualizar progreso del usuario después de un intento
export async function updateUserProgress(userId, isCorrect) {
  try {
    const result = await query(
      `UPDATE user_progress 
       SET 
         total_attempts = total_attempts + 1, 
         correct_attempts = correct_attempts + $1,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING *`,
      [isCorrect ? 1 : 0, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar progreso del usuario:', error);
    throw error;
  }
}

// Registrar intento con un verbo específico
export async function updateVerbProgress(userId, verb, isCorrect) {
  try {
    // Comprobar si ya existe un registro para este usuario y verbo
    const checkResult = await query(
      'SELECT * FROM verb_progress WHERE user_id = $1 AND verb = $2',
      [userId, verb]
    );

    if (checkResult.rows.length === 0) {
      // Crear nuevo registro
      const result = await query(
        `INSERT INTO verb_progress (user_id, verb, attempts, correct, last_practiced)
         VALUES ($1, $2, 1, $3, CURRENT_TIMESTAMP)
         RETURNING *`,
        [userId, verb, isCorrect ? 1 : 0]
      );
      return result.rows[0];
    } else {
      // Actualizar registro existente
      const result = await query(
        `UPDATE verb_progress
         SET attempts = attempts + 1,
             correct = correct + $1,
             last_practiced = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND verb = $3
         RETURNING *`,
        [isCorrect ? 1 : 0, userId, verb]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error('Error al actualizar progreso del verbo:', error);
    throw error;
  }
}

// Obtener estadísticas de verbos para un usuario
export async function getVerbStats(userId) {
  try {
    const result = await query(
      `SELECT verb, attempts, correct, 
       ROUND((correct::NUMERIC / NULLIF(attempts, 0)) * 100, 2) as success_rate,
       last_practiced
       FROM verb_progress
       WHERE user_id = $1
       ORDER BY last_practiced DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error al obtener estadísticas de verbos:', error);
    throw error;
  }
}

// Obtener los verbos más difíciles (menor tasa de éxito)
export async function getDifficultVerbs(userId, limit = 10) {
  try {
    const result = await query(
      `SELECT verb, attempts, correct, 
       ROUND((correct::NUMERIC / NULLIF(attempts, 0)) * 100, 2) as success_rate
       FROM verb_progress
       WHERE user_id = $1 AND attempts > 2
       ORDER BY success_rate ASC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error al obtener verbos difíciles:', error);
    throw error;
  }
} 