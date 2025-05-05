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
  // Añade configuración SSL si es necesaria para Neon
  // ssl: {
  //   rejectUnauthorized: false 
  // } 
});

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
        email: { label: "Email", type: "text", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Añade lógica aquí para buscar al usuario a partir de
        // las credenciales proporcionadas
        if (!credentials?.email || !credentials?.password) {
          console.log('Faltan credenciales');
          return null;
        }

        // Usar la función importada de db.js
        const user = await getUserByEmail(credentials.email); 
        
        if (user && user.password) {
           // ¡IMPORTANTE! Comparar la contraseña enviada con la hasheada en la BD
           const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

           if (passwordsMatch) {
            // Cualquier objeto devuelto aquí será guardado en el token JWT `user`
            // y también pasado al adaptador para la sesión de base de datos.
            // Devuelve solo los datos necesarios del usuario, NUNCA la contraseña.
             console.log('Usuario autenticado:', user.email);
             return user; // Devolver el objeto user completo aquí es importante para el callback jwt
           } else {
             console.log('Contraseña incorrecta para:', credentials.email);
             return null; // Contraseña incorrecta
           }
        } else {
           console.log('Usuario no encontrado o sin contraseña:', credentials.email);
          // Si devuelves null, se mostrará un error al usuario
          return null;
        }
      }
    })
    // ...añadir más proveedores aquí si quieres (Google, GitHub, etc.)
  ],
  // Cambiar la estrategia de sesión a JWT
  session: {
    strategy: "jwt", 
    // maxAge y updateAge son relevantes para JWT también si quieres personalizar
    // maxAge: 30 * 24 * 60 * 60, 
    // updateAge: 24 * 60 * 60, 
  },
  // Necesitas una clave secreta para firmar las cookies/tokens
  // Guárdala en tus variables de entorno (.env.local)
  secret: process.env.NEXTAUTH_SECRET,

  // Opcional: Personalizar páginas de inicio de sesión, error, etc.
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // },

  // Callbacks para controlar el flujo (opcional pero útil)
  callbacks: {
    // Callback JWT: se ejecuta al crear/actualizar un token JWT
    async jwt({ token, user, account, profile, isNewUser }) {
      // El objeto 'user' solo está presente en el primer inicio de sesión después de authorize.
      // En las siguientes llamadas, solo viene 'token'.
      // Persistimos el id del usuario en el token.
      if (user?.id) {
        token.id = user.id;
      }
      // Puedes añadir más datos al token aquí si es necesario
      // if (account?.provider === "google") { token.googleAccessToken = account.access_token; }
      return token;
    },
    // Callback Session: se ejecuta al consultar la sesión desde el cliente
    async session({ session, token }) {
      // El token JWT (con los datos añadidos en el callback jwt) está disponible aquí.
      // Añadimos el id del usuario (y otros datos si los añadiste al token) a la sesión del cliente.
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      // if (token?.googleAccessToken && session.user) { session.user.googleAccessToken = token.googleAccessToken; }
      // console.log("Session generada desde token:", session);
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 