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
      user_name TEXT,
      user_level TEXT DEFAULT 'beginner',
      total_attempts INTEGER DEFAULT 0,
      correct_attempts INTEGER DEFAULT 0,
      last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      streak_days INTEGER DEFAULT 0,
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
      mastery_level INTEGER DEFAULT 0,
      last_practiced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, verb)
    )
  `;

  const createUserAchievementsTable = `
    CREATE TABLE IF NOT EXISTS user_achievements (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, achievement_id)
    )
  `;

  try {
    await query(createUserProgressTable, []);
    await query(createVerbProgressTable, []);
    await query(createUserAchievementsTable, []);
    
    // Verificar y actualizar la estructura de tabla user_progress si es necesario
    const checkUserColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_progress' AND column_name IN ('user_name', 'user_level', 'streak_days', 'last_active')
    `, []);
    
    const missingColumns = [];
    const expectedColumns = ['user_name', 'user_level', 'streak_days', 'last_active'];
    const existingColumns = checkUserColumns.rows.map(row => row.column_name);
    
    expectedColumns.forEach(column => {
      if (!existingColumns.includes(column)) {
        missingColumns.push(column);
      }
    });
    
    // Añadir columnas faltantes si es necesario
    for (const column of missingColumns) {
      let alterQuery = '';
      
      switch(column) {
        case 'user_name':
          alterQuery = `ALTER TABLE user_progress ADD COLUMN user_name TEXT`;
          break;
        case 'user_level':
          alterQuery = `ALTER TABLE user_progress ADD COLUMN user_level TEXT DEFAULT 'beginner'`;
          break;
        case 'streak_days':
          alterQuery = `ALTER TABLE user_progress ADD COLUMN streak_days INTEGER DEFAULT 0`;
          break;
        case 'last_active':
          alterQuery = `ALTER TABLE user_progress ADD COLUMN last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
          break;
      }
      
      if (alterQuery) {
        await query(alterQuery, []);
        console.log(`Columna ${column} añadida a user_progress`);
      }
    }
    
    console.log('Tablas creadas/actualizadas correctamente');
  } catch (error) {
    console.error('Error al crear/actualizar tablas:', error);
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
    const now = new Date();
    
    // Actualizar contadores y fecha de actividad
    const result = await query(
      `UPDATE user_progress 
       SET 
         total_attempts = total_attempts + 1, 
         correct_attempts = correct_attempts + $1,
         last_active = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING *`,
      [isCorrect ? 1 : 0, userId]
    );
    
    // Si no hay resultado, crear el perfil de usuario
    if (result.rowCount === 0) {
      const newUser = await query(
        `INSERT INTO user_progress 
         (user_id, total_attempts, correct_attempts) 
         VALUES ($1, 1, $2) 
         RETURNING *`,
        [userId, isCorrect ? 1 : 0]
      );
      return newUser.rows[0];
    }
    
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
      const verbProgress = checkResult.rows[0];
      
      // Calcular nuevo nivel de maestría (0-5)
      let newMasteryLevel = verbProgress.mastery_level || 0;
      const successRate = (verbProgress.correct + (isCorrect ? 1 : 0)) / (verbProgress.attempts + 1);
      
      // Actualizar nivel de maestría basado en tasa de éxito y número de intentos
      if (verbProgress.attempts >= 5) {
        if (successRate >= 0.9) newMasteryLevel = 5;
        else if (successRate >= 0.8) newMasteryLevel = 4;
        else if (successRate >= 0.7) newMasteryLevel = 3;
        else if (successRate >= 0.6) newMasteryLevel = 2;
        else if (successRate >= 0.5) newMasteryLevel = 1;
        else newMasteryLevel = 0;
      }
      
      const result = await query(
        `UPDATE verb_progress
         SET attempts = attempts + 1,
             correct = correct + $1,
             mastery_level = $2,
             last_practiced = CURRENT_TIMESTAMP
         WHERE user_id = $3 AND verb = $4
         RETURNING *`,
        [isCorrect ? 1 : 0, newMasteryLevel, userId, verb]
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
      `SELECT verb, attempts, correct, mastery_level,
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
      `SELECT verb, attempts, correct, mastery_level,
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

// Actualizar información de usuario (nombre, nivel)
export async function updateUserInfo(userId, name, level) {
  try {
    const result = await query(
      `UPDATE user_progress
       SET user_name = $1,
           user_level = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3
       RETURNING *`,
      [name, level, userId]
    );
    
    if (result.rowCount === 0) {
      const newUser = await query(
        `INSERT INTO user_progress
         (user_id, user_name, user_level)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, name, level]
      );
      return newUser.rows[0];
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar información de usuario:', error);
    throw error;
  }
} 