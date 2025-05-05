import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from 'bcrypt';
import { getUserByEmail } from "@/lib/db"; // Corregir la ruta de importación usando el alias @

// Reutiliza la conexión de db.js si es posible, o crea una nueva aquí
// Asegúrate de que DATABASE_URL está en tus variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Asegúrate de que SSL esté configurado si es necesario
});

// Verificar que exista la variable de entorno
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ No NEXTAUTH_SECRET found in environment variables. Using fallback secret (NOT SECURE for production).");
}

// Clave fija para desarrollo como fallback (solo si no hay variable de entorno)
// En producción, SIEMPRE usa variables de entorno
const FALLBACK_SECRET = "e9e1b1c2d4e2f6g3h1i8j5k3l1m5n7o9p2q3r7s6t8u9v2w4x5y8z3";
const actualSecret = process.env.NEXTAUTH_SECRET || FALLBACK_SECRET;

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    CredentialsProvider({
      // El nombre para mostrar en el formulario de inicio de sesión (opcional)
      name: "Credentials",
      // `credentials` se usa para generar un formulario en la página de inicio de sesión predeterminada.
      // Puedes especificar los campos que esperas que se envíen.
      // ej.: domain, username, password, 2FA token, etc.
      // Puedes pasar cualquier atributo HTML adicional al tag <input> especificándolo aquí.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("--- Authorize Attempt ---");
        console.log("Credentials received:", { email: credentials?.email }); // No loguear password directamente

        if (!credentials?.email || !credentials?.password) {
          console.log('Authorize Error: Faltan credenciales');
          return null; // Retorna null si faltan credenciales
        }

        let user = null;
        try {
          user = await getUserByEmail(credentials.email); 
          console.log("User fetched from DB:", user ? { id: user.id, email: user.email, hasPassword: !!user.password } : null);
        } catch (dbError) {
          console.error("Authorize Error: Database error fetching user:", dbError);
          return null; // Retorna null en caso de error de DB
        }
        
        // Verificar si se encontró el usuario y si tiene contraseña hasheada
        if (user && user.password) {
           console.log("User found, comparing passwords...");
           let passwordsMatch = false;
           try {
              passwordsMatch = await bcrypt.compare(credentials.password, user.password);
              console.log("Password comparison result:", passwordsMatch);
           } catch (compareError) {
              console.error("Authorize Error: bcrypt.compare failed:", compareError);
              return null; // Retorna null si falla la comparación
           }

           if (passwordsMatch) {
             console.log('Authorize Success: Passwords match!');
             // Devuelve el objeto de usuario SIN la contraseña
             const { password, ...userWithoutPassword } = user;
             return userWithoutPassword; 
           } else {
             console.log('Authorize Error: Contraseña incorrecta');
             return null; // Contraseña incorrecta
           }
        } else if (user && !user.password) {
            console.log('Authorize Error: Usuario encontrado pero no tiene contraseña (posiblemente OAuth?)');
            return null; // Usuario existe pero sin password (quizás registró con Google/otro)
        } else {
           console.log('Authorize Error: Usuario no encontrado');
           return null; // Usuario no encontrado
        }
      }
    })
    // ...añadir más proveedores aquí si quieres (Google, GitHub, etc.)
  ],
  // Cambiar la estrategia de sesión a JWT
  session: {
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60, // 30 días 
  },
  // Usar la clave secreta definida
  secret: actualSecret,

  // Configuración de cookies seguras
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 días
      },
    },
  },

  // Opcional: Personalizar páginas de inicio de sesión, error, etc.
  pages: {
    signIn: '/auth', // Redirigir a tu página unificada
    error: '/auth', // Puedes mostrar errores en la misma página /auth
  },

  // Debugging en desarrollo
  debug: process.env.NODE_ENV === "development",

  // Callbacks para controlar el flujo (opcional pero útil)
  callbacks: {
    // Callback JWT: se ejecuta al crear/actualizar un token JWT
    async jwt({ token, user }) {
      // Persistir el ID del usuario en el token
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    // Callback Session: se ejecuta al consultar la sesión desde el cliente
    async session({ session, token }) {
      // Añadir el ID del usuario a la sesión del cliente
      if (token?.id && session.user) {
        session.user.id = token.id; 
      }
      return session;
    }
  },

  // Configuración de JWT personalizada para mayor seguridad
  jwt: {
    // Para mayor seguridad, generar un nuevo token en cada sesión
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // Configuración avanzada de eventos
  events: {
    // Registro cuando un usuario inicia sesión
    async signIn(message) {
      console.log('User signed in:', message.user.email);
    },
    // Registro cuando ocurre un error de sesión
    async error(message) {
      console.error('Auth error:', message);
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 