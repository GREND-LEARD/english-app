'use client'; // Añadir esta línea al principio

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para saber la ruta actual
import { useState } from 'react'; // Importar useState
import { motion, AnimatePresence } from 'framer-motion'; // Importar motion y AnimatePresence
import { useSession, signIn, signOut } from 'next-auth/react'; // Importar hooks de NextAuth

// Componente reutilizable para los enlaces de navegación
function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
        ${isActive
          ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        md:text-sm md:inline-block md:mt-0`
      }
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession(); // Obtener estado de la sesión
  const isLoading = status === "loading";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    closeMobileMenu(); // Cerrar menú si está abierto
    await signOut({ callbackUrl: '/' }); // Redirigir a home después de cerrar sesión
  };

  const handleSignIn = () => {
    closeMobileMenu();
    signIn(); // Redirige a la página de login por defecto de NextAuth o a la configurada
    // O usa router.push('/login') si prefieres una página custom y llamas a signIn desde allí
  };
  
  const handleRegister = () => {
    closeMobileMenu();
    // Necesitarás importar useRouter si usas esto
    // router.push('/register');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo o Título */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMobileMenu} className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Verb Master
            </Link>
          </div>

          {/* Enlaces Desktop + Auth */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {/* Enlaces de Navegación */}
            <div className="flex items-baseline space-x-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/verbs">Verbs</NavLink>
              <NavLink href="/practice">Practice</NavLink>
              <NavLink href="/flashcards">Flashcards</NavLink>
              {/* Opcional: Mostrar enlace a Progreso si está logueado */}
              {session && <NavLink href="/progress">Progress</NavLink>}
            </div>

            {/* Sección de Autenticación (Desktop) */}
            <div className="ml-4 flex items-center space-x-2">
              {isLoading ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">Cargando...</span>
              ) : session ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden lg:inline">
                    {session.user?.email || session.user?.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Entrar
                  </button>
                  <Link
                     href="/register" 
                     className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                   >
                     Registrarse
                  </Link>
                  {/* <button onClick={handleRegister} ... >Registrarse</button> */}
                </>
              )}
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="-mr-2 flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable con Auth */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink href="/" onClick={closeMobileMenu}>Home</NavLink>
              <NavLink href="/verbs" onClick={closeMobileMenu}>Verbs</NavLink>
              <NavLink href="/practice" onClick={closeMobileMenu}>Practice</NavLink>
              <NavLink href="/flashcards" onClick={closeMobileMenu}>Flashcards</NavLink>
              {session && <NavLink href="/progress" onClick={closeMobileMenu}>Progress</NavLink>}
              
              {/* Separador y Auth en móvil */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"></div>
              {isLoading ? (
                 <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</div>
              ) : session ? (
                <div className="px-3 py-2 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{session.user?.email || session.user?.name}</p>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button 
                    onClick={handleSignIn}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                      Iniciar Sesión
                  </button>
                  <Link 
                    href="/register" 
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                      Registrarse
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 