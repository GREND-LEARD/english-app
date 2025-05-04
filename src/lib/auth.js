import { v4 as uuidv4 } from 'uuid';

// Nombre de la cookie para el ID de usuario anónimo
const USER_ID_COOKIE = 'verb_master_user_id';

/**
 * Determina si se está ejecutando en el lado del cliente
 */
export function isClient() {
  return typeof window !== 'undefined';
}

/**
 * Establece una cookie en el navegador
 */
export function setCookie(name, value, days) {
  if (!isClient()) return;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  const cookie = `${name}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = cookie;
}

/**
 * Obtiene el valor de una cookie por su nombre
 */
export function getCookie(name) {
  if (!isClient()) return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

/**
 * Obtiene el ID de usuario anónimo de las cookies o crea uno nuevo si no existe
 */
export function getOrCreateUserId() {
  if (!isClient()) return null;
  
  let userId = getCookie(USER_ID_COOKIE);
  
  // Si no existe un ID de usuario, crear uno nuevo
  if (!userId) {
    userId = uuidv4();
    setCookie(USER_ID_COOKIE, userId, 365); // 1 año
  }
  
  return userId;
}

/**
 * Obtiene el ID de usuario anónimo (compatible con el lado del cliente)
 */
export function getUserId() {
  if (!isClient()) return null;
  
  const userId = getCookie(USER_ID_COOKIE);
  if (!userId) {
    return getOrCreateUserId();
  }
  
  return userId;
} 